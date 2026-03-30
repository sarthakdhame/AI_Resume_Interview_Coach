import axios from 'axios';
import { API_BASE_URL } from '../../../config'

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})

/**
 * @description Generate interview report
 */

export const generateInterviewReport = async ({ selfDescription, jobDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append('jobDescription', jobDescription)
    formData.append('selfDescription', selfDescription)
    if (resumeFile) {
        formData.append('resume', resumeFile)
    }

    return axios.post(`${API_BASE_URL}/api/interview/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
    })
        .then(response => response.data)
        .catch(err => { throw err })

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

