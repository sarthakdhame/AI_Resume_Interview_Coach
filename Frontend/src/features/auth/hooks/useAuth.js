import { useContext } from 'react'
import { AuthContext } from '../services/auth.context'
import { login, register, logout } from '../services/auth.api'




export const useAuth = () => {

    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    const { user, setUser, loading, setLoading, error, setError } = context

    const getErrorMessage = (err, fallback) => {
        return err?.response?.data?.error || err?.response?.data?.message || err?.message || fallback
    }

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        setError('')
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return true
        } catch (err) {
            setError(getErrorMessage(err, 'Login failed.'))
            return false
        } finally {
            setLoading(false)
        }

    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        setError('')
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            return true
        } catch (err) {
            setError(getErrorMessage(err, 'Registration failed.'))
            return false

        } finally {
            setLoading(false)
        }


    }
    const handleLogout = async () => {
        setLoading(true)
        setError('')
        try {
            const data = await logout()
            setUser(null)
            return true
        } catch (err) {
            setError(getErrorMessage(err, 'Logout failed.'))
            return false

        } finally {
            setLoading(false)
        }

    }

    return { user, loading, error, handleRegister, handleLogin, handleLogout }

}