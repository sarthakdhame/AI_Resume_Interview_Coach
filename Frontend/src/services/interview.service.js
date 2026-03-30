import axios from 'axios';
import { API_BASE_URL } from '../config';

const BASE_URL = API_BASE_URL;

/**
 * @description Generate interview report with job description and resume
 */
export const generateInterviewReport = async (data) => {
    return axios.post(`${BASE_URL}/api/interview`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
    });
};

/**
 * @description Get interview report by ID
 */
export const getInterviewReportById = async (interviewId) => {
    return axios.get(`${BASE_URL}/api/interview/${interviewId}`, {
        withCredentials: true
    });
};

/**
 * @description Generate resume PDF
 */
export const generateResumePdf = async (interviewReportId) => {
    return axios.post(`${BASE_URL}/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: 'blob',
        withCredentials: true
    });
};

/**
 * @description Get all interview reports for logged-in user
 */
export const getAllInterviewReports = async () => {
    return axios.get(`${BASE_URL}/api/interview/`, {
        withCredentials: true
    });
};
