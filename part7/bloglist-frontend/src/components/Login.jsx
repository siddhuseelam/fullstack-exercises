import React, { useState } from 'react'
import { useContext } from 'react'


const Login = ({ handleLogin }) => {
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handlesubmit = (event) => {
        event.preventDefault()
        handleLogin({
            username,
            password
        })
        setUsername('')
        setPassword('')
    }

    return (
        <form onSubmit={handlesubmit}>
            <div>
                username
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({target}) => setUsername(target.value)}
                />
            </div>

            <div>
                password
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({target}) => setPassword(target.value)}
                />
            </div>
            
            <div>
                <button type="submit">login</button>    
            </div>
        </form>
    )               
}

export default Login


