import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// 🔥 FIX: usar import.meta.env en lugar de process.env
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000'
})

const Login = ({ onAuth }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const r = await api.post('/auth/login', { email, password })
      const { token, usuario } = r.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(usuario))

      if (onAuth) onAuth(token)
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.message || 'Login error')
    }
  }

  return (
    <div className="auth card" style={{padding:18,maxWidth:520}}>
      <h2 style={{marginTop:0}}>Login</h2>
      <form onSubmit={submit} className="form">
        <label>Email  
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </label>

        <label>Password  
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>

        <div style={{display:'flex',gap:8,justifyContent:'space-between',alignItems:'center'}}>
          <button className="btn primary" type="submit">Login</button>
          <div className="muted">No account? <a href="/register">Register</a></div>
        </div>
      </form>
    </div>
  )
}

export default Login
