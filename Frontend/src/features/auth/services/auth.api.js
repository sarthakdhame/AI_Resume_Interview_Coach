import axios from 'axios'
import { API_BASE_URL } from '../../../config'

const TOKEN_KEY = 'ai_resume_auth_token'

function getStoredToken() {
    return localStorage.getItem(TOKEN_KEY)
}

function setStoredToken(token) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token)
    }
}

function clearStoredToken() {
    localStorage.removeItem(TOKEN_KEY)
}

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    const token = getStoredToken()
    if (token) {
        config.headers = {
            ...(config.headers || {}),
            Authorization: `Bearer ${token}`
        }
    }
    return config
})

export async function register({ username, email, password }) {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        setStoredToken(response?.data?.token)

        return response.data

    } catch (err) {
        throw err
    }

}


export async function login({ email, password }) {
    try {

        const response = await api.post("/api/auth/login", {
            email, password
        })

        setStoredToken(response?.data?.token)

        return response.data

    } catch (err) {
        throw err
    }
}

export async function logout() {
    try {

        const response = await api.post('/api/auth/logout')

        clearStoredToken()

        return response.data

    } catch (err) {
        throw err
    }
}

export async function getMe() {
    try {

        const response = await api.get('/api/auth/get-me')

        return response.data


    } catch (err) {
        if (err?.response?.status === 401) {
            return null
        }
        throw err
    }
}