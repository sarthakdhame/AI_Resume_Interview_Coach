const { GoogleGenAI } = require("@google/genai")
const { z } = require('zod')
const { zodToJsonSchema } = require('zod-to-json-schema')
const puppeteer = require('puppeteer')

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})






const interviewReportSchema = {
    type: "object",
    properties: {
        title: {
            type: "string",
            description: "The job title or position being interviewed for"
        },
        matchScore: {
            type: "number",
            description: "A score between 0 and 100 indicating how well the candidate matches the job"
        },
        technicalQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The technical question" },
                    intenstion: { type: "string", description: "The intention behind asking this question" },
                    answer: { type: "string", description: "How to answer this question" }
                },
                required: ["question", "intenstion", "answer"]
            },
            description: "At least 5-8 technical questions"
        },
        behaviouralQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The behavioral question" },
                    intenstion: { type: "string", description: "The intention behind asking this question" },
                    answer: { type: "string", description: "How to answer this question" }
                },
                required: ["question", "intenstion", "answer"]
            },
            description: "At least 5-8 behavioral questions"
        },
        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string", description: "The skill the candidate is lacking" },
                    severity: {
                        type: "string",
                        enum: ["low", "medium", "high"],
                        description: "How critical this skill gap is"
                    }
                },
                required: ["skill", "severity"]
            },
            description: "List of skill gaps"
        },
        preparationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day: { type: "number", description: "The day number (1-30)" },
                    focus: { type: "string", description: "Main focus area for this day" },
                    tasks: {
                        type: "array",
                        items: { type: "string", description: "A specific task to complete" },
                        description: "List of specific tasks for this day"
                    }
                },
                required: ["day", "focus", "tasks"]
            },
            description: "15-30 day preparation plan with specific daily tasks"
        }
    },
    required: ["title", "matchScore", "technicalQuestions", "behaviouralQuestions", "skillGaps", "preparationPlan"]
}

function parseJsonResponseText(rawText) {
    if (!rawText || typeof rawText !== 'string') {
        throw new Error('Empty AI response received.')
    }

    const trimmed = rawText.trim()
    const withoutCodeFence = trimmed
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/, '')
        .trim()

    return JSON.parse(withoutCodeFence)
}


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    try {
        if (!process.env.GOOGLE_GENAI_API_KEY) {
            const configError = new Error('Missing GOOGLE_GENAI_API_KEY')
            configError.statusCode = 500
            configError.clientMessage = 'AI service is not configured on the server. Please contact support.'
            throw configError
        }

        const prompt = `You are an expert technical recruiter and interview coach. Analyze the following candidate information and generate a comprehensive interview report in JSON format.

        Candidate Resume:
        ${resume}

        Candidate Self Description:
        ${selfDescription}

        Job Description:
        ${jobDescription}

        Based on this information, generate DETAILED:
        1. A title - the job position/title being interviewed for
        2. A matchScore (0-100) showing how well the candidate fits the job
        3. At least 5-8 technical questions specific to the required skills
        4. At least 5-8 behavioral questions to assess soft skills and fit
        5. Specific skill gaps and their severity (low/medium/high)
        6. A 15-30 day preparation plan with daily focus areas and specific tasks

        Make sure to generate ACTUAL CONTENT for all fields. Do not leave any arrays empty.`;

        console.log('Starting Gemini API call with model: gemini-2.5-flash')
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: interviewReportSchema,
            }
        })

        console.log('Gemini response received')
        const responseText = typeof response?.text === 'function' ? response.text() : response?.text
        const report = parseJsonResponseText(responseText)
        console.log('Interview report parsed and generated successfully')
        return report
    } catch (err) {
        console.error('Error generating interview report:', err.message)
        console.error('Full error:', err)

        const message = String(err?.message || '').toLowerCase()

        if (!err?.statusCode && (message.includes('quota') || message.includes('rate') || message.includes('429'))) {
            err.statusCode = 503
            err.clientMessage = 'AI service is temporarily busy. Please retry in a minute.'
        }

        if (!err?.statusCode && message.includes('api key')) {
            err.statusCode = 500
            err.clientMessage = 'AI service is not configured on the server. Please contact support.'
        }

        if (!err?.statusCode && (message.includes('json') || message.includes('parse'))) {
            err.statusCode = 502
            err.clientMessage = 'Received an invalid response from AI service. Please try again.'
        }

        throw err
    }
}


async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({
        format: 'A4', margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })
    await browser.close()
    return pdfBuffer
}


async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF  using a library like Puppeteer or wkhtmltopdf")

    })
    const prompt = `Generate resume for a candidate with the flowing details:
                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}

                    the response should be in JSON object with a single field "html" which contains the resume which can be converted to PDF using a library like Puppeteer or wkhtmltopdf.
                    The resume should be tailored for the given job description and should highligh the candidate's strengths and experience. Make sure the generated HTML is well formatted and styled for a professional resume.
                    the  content of the resume should be not sound like  its generated by ai and should be as close as possible to a real human written resume.
                    you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                    the content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                    the resume shoult not be so lengthy, it should ideally be 1-2 pages long when converted to pdf. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidates chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(resumePdfSchema)
        }
    })

    const jsonContent = JSON.parse(response.text)
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
    return pdfBuffer

}



module.exports = {
    generateInterviewReport,
    generateResumePdf,
    generatePdfFromHtml

}