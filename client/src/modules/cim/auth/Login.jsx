import React, { useState } from 'react'
import { login } from '../api/auth'

export default function Login({ onLoggedIn }){
  const [form, setForm] = useState({ username:'', password:'' })

  const submit = async (e) => {
    e.preventDefault()
    try{
      const { token, role, name } = await login(form)
      localStorage.setItem('token', token)
      try { localStorage.setItem('user', JSON.stringify({ role, name })); } catch {}
      onLoggedIn({ role, name })
      if (window.location.hash !== '#/Dashboard') window.location.hash = '#/Dashboard'
    }catch(e){ alert(e?.response?.data?.error || 'Login failed') }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{minHeight:'100vh'}}>
      <div className="card shadow-sm maxw-380 w-100">
        <div className="card-body">
          <h5 className="mb-3"><i className="fa-solid fa-right-to-bracket me-2"></i>Login</h5>
          <form onSubmit={submit}>
            <div className="mb-2">
              <label className="form-label">Username</label>
              <input className="form-control" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
            </div>
            <button className="btn btn-primary w-100">Login</button>
          </form>
          <div className="text-secondary small mt-3">Default: admin/admin123, worker/worker123</div>
        </div>
      </div>
    </div>
  )
}