const generateInterviewReport = require('../services/ai.service')

async function generateInterviewReportController(req, res) {
    const { resume, selfDescription, jobDescription } = req.body

    if (!resume || !selfDescription || !jobDescription) {
        return res.status(400).json({
            message: 'Please provide resume, selfDescription and jobDescription'
        })
    }

    try {
        const report = await generateInterviewReport({
            resume,
            selfDescription,
            jobDescription
        })

        return res.status(200).json({
            message: 'Interview report generated successfully',
            report
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Failed to generate interview report',
            error: err.message
        })
    }
}

module.exports = {
    generateInterviewReportController
}
