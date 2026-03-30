const LEGACY_BACKEND_URL = 'https://airesumeinterviewcoach-backend.onrender.com'
const WORKING_BACKEND_URL = 'https://ai-resume-interview-coach-mtbk.onrender.com'

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim()
const defaultBaseUrl = import.meta.env.PROD ? WORKING_BACKEND_URL : 'http://localhost:3000'

export const API_BASE_URL = configuredBaseUrl
	? (configuredBaseUrl === LEGACY_BACKEND_URL ? WORKING_BACKEND_URL : configuredBaseUrl)
	: defaultBaseUrl
