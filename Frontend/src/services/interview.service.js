import api from './api';

/**
 * @description Generate interview report with job description and resume
 */
export const generateInterviewReport = async (data) => {
    return api.post('/api/interview', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * @description Get interview report by ID
 */
export const getInterviewReportById = async (interviewId) => {
    return api.get(`/api/interview/${interviewId}`);
};

/**
 * @description Generate resume PDF
 */
export const generateResumePdf = async (interviewReportId) => {
    return api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: 'blob'
    });
};

/**
 * @description Get all interview reports for logged-in user
 */
export const getAllInterviewReports = async () => {
    return api.get('/api/interview/');
};
