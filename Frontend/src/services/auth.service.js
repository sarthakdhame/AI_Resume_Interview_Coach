import axios from 'axios';
import { API_BASE_URL } from '../config';

const BASE_URL = API_BASE_URL;

/**
 * @description User registration
 */
export const register = async ({ username, email, password }) => {
    return axios.post(`${BASE_URL}/api/auth/register`, {
        username,
        email,
        password
    }, {
        withCredentials: true
    });
};

/**
 * @description User login
 */
export const login = async ({ email, password }) => {
    return axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password
    }, {
        withCredentials: true
    });
};

/**
 * @description User logout
 */
export const logout = async () => {
    return axios.post(`${BASE_URL}/api/auth/logout`, null, {
        withCredentials: true
    });
};

/**
 * @description Get current user info
 */
export const getMe = async () => {
    return axios.get(`${BASE_URL}/api/auth/me`, {
        withCredentials: true
    });
};

/**
 * @description Refresh auth token
 */
export const refresh = async () => {
    return axios.post(`${BASE_URL}/api/auth/refresh`, null, {
        withCredentials: true
    });
};
