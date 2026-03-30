import react from 'react'
import { useState } from 'react'
import '../services/auth.form.scss'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'


const Login = () => {
    const { loading, handleLogin, error } = useAuth()
    const navigate = useNavigate()


    const [email, setEmail] = react.useState("")
    const [password, setPassword] = useState("")



    const handleSubmit = async (e) => {
        e.preventDefault()
        const isSuccess = await handleLogin({ email, password })
        if (isSuccess) {
            navigate('/')
        }
    }

    if (loading) {
        return (<main><h1>Loading.......</h1></main>)
    }


    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor='email'>Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name="email" placeholder="Enter email address"></input>
                    </div>
                    <div className="input-group">
                        <label htmlFor='password'>Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name="password" placeholder="Enter password"></input>
                    </div>

                    <button type='submit' className='button primary-button'>Login</button>
                </form>
                {error && <p style={{ color: '#a11' }}>{error}</p>}
                <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
            </div>
        </main>
    )
}


export default Login
