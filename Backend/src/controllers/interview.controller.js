const { PDFParse } = require('pdf-parse')
const { generateInterviewReport, generateResumePdf } = require('../services/ai.service')
const interviewReportModel = require('../models/interviewReport.model')
const { isValidObjectId } = require('mongoose')

/**
 * @description Controller to generate interview report based on user self description, resume pdf and job description
 */

async function generateInterviewReportController(req, res) {
    try {
        const { selfDescription = '', jobDescription = '' } = req.body

        if (!jobDescription.trim()) {
            return res.status(400).json({ error: 'Job description is required.' })
        }

        if (!req.file && !selfDescription.trim()) {
            return res.status(400).json({ error: 'Provide either a resume file or self description.' })
        }

        let resumeContent = ''
        if (req.file?.buffer) {
            const parser = new PDFParse({ data: req.file.buffer })
            const parsed = await parser.getText()
            await parser.destroy()
            resumeContent = parsed?.text || ''
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        })

        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        })
    } catch (error) {
        console.error('Error creating interview report:', error)
        return res.status(500).json({ error: 'Failed to generate interview report.' })
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        if (!isValidObjectId(interviewId)) {
            return res.status(400).json({ error: 'Invalid interview id.' })
        }

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        })

        if (!interviewReport) {
            return res.status(404).json({ error: 'Interview report not found.' })
        }

        return res.status(200).json({ interviewReport })
    } catch (error) {
        console.error('Error fetching interview report:', error)
        return res.status(500).json({ error: 'Failed to fetch interview report.' })
    }
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .select('-resume -selfDescription -jobDescription -__v -technicalQuestions -behaviouralQuestions -behavioralQuestions -skillGaps -preparationPlan')
            .lean()

        interviewReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        return res.status(200).json({ interviewReports })
    } catch (error) {
        console.error('Error fetching all interview reports:', error)
        return res.status(500).json({ error: 'Failed to fetch interview reports.' })
    }
}

/**
 * @description Controller to generate resume PDF based on interview report data.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        if (!isValidObjectId(interviewReportId)) {
            return res.status(400).json({ error: 'Invalid interview report id.' })
        }

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        })

        if (!interviewReport) {
            return res.status(404).json({ error: 'Interview report not found.' })
        }

        const { resume = '', selfDescription = '', jobDescription = '' } = interviewReport
        const pdfBuffer = await generateResumePdf({ resume, selfDescription, jobDescription })

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=resume_${interviewReportId}.pdf`
        })

        return res.status(200).send(pdfBuffer)
    } catch (error) {
        console.error('Error generating resume PDF:', error)
        return res.status(500).json({ error: 'Failed to generate resume PDF.' })
    }
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }