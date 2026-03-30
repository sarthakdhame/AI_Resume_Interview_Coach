import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports, error, setError } = context

    const getErrorMessage = (err, fallback) => {
        return err?.response?.data?.error || err?.response?.data?.message || err?.message || fallback
    }

    const generateReport = async ({ jobDescription, selfDescription, resumeFile, resume }) => {
        setLoading(true)
        setError('')
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile: resumeFile || resume })
            setReport(response.interviewReport)
        } catch (error) {
            const message = getErrorMessage(error, 'Failed to generate interview report.')
            setError(message)
        } finally {
            setLoading(false)
        }

        return response?.interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        setError('')
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            const message = getErrorMessage(error, 'Failed to load interview report.')
            setError(message)
        } finally {
            setLoading(false)
        }
        return response?.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        setError('')
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            const message = getErrorMessage(error, 'Failed to load interview reports.')
            setError(message)
        } finally {
            setLoading(false)
        }

        return response?.interviewReports
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        setError('')
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const pdfBlob = new Blob([response], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(pdfBlob)
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        }
        catch (error) {
            const message = getErrorMessage(error, 'Failed to generate resume PDF.')
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId])

    return { loading, report, reports, error, generateReport, getReportById, getReports, getResumePdf }

}