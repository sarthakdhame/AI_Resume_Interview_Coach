import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,

})

/**
 * @description
 */

export const generateInterviewReport = async ({ selfDescription, jobDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append('jobDescription', jobDescription)
    formData.append('selfDescription', selfDescription)
    if (resumeFile) {
        formData.append('resume', resumeFile)
    }

    const response = await api.post('/api/interview/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

    return response.data

}

/**
 * @description service to get intrview report by interviewId
 */

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/${interviewId}`)

    return response.data
}


/**
 * @description service to generate resume pdf on the basis of user self description, resume content and job description
 */

export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: 'blob'
    })

    return response.data
}

/**
 * @description service to get all interview reports of logged in user
 */
export const getAllInterviewReports = async () => {
    const response = await api.get('/api/interview/')

    return response.data
}

