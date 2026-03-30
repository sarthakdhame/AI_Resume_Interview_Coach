import api from './api';

/**
 * @description User registration
 */
export const register = async ({ username, email, password }) => {
    return api.post('/api/auth/register', {
        username,
        email,
        password
    });
};

/**
 * @description User login
 */
export const login = async ({ email, password }) => {
    return api.post('/api/auth/login', {
        email,
        password
    });
};

/**
 * @description User logout
 */
export const logout = async () => {
    return api.post('/api/auth/logout');
};

/**
 * @description Get current user info
 */
export const getMe = async () => {
    return api.get('/api/auth/me');
};

/**
 * @description Refresh auth token
 */
export const refresh = async () => {
    return api.post('/api/auth/refresh');
};
