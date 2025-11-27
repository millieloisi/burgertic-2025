import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000' })

const Register = () => {
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '' })
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const payload = { usuario: form }
      await api.post('/auth/register', payload)
      alert('Registered — please login')
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.message || 'Register error')
    }
  }

  return (
    <div className="auth card" style={{ padding: 18, maxWidth: 640, margin: '16px auto' }}>
      <h2 style={{ marginTop: 0 }}>Create an account</h2>

      <form onSubmit={submit} className="form">
        <div style={{ display: 'flex', gap: 12 }}>
          <label style={{ flex: 1 }}>
            First name
            <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
          </label>

          <label style={{ flex: 1 }}>
            Last name
            <input value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} />
          </label>
        </div>

        <label>
          Email
          <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </label>

        <label>
          Password
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </label>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn primary" type="submit">Register</button>
          <div className="muted">Already have an account? <a href="/login">Login</a></div>
        </div>
      </form>
    </div>
  )
}

export default Register
