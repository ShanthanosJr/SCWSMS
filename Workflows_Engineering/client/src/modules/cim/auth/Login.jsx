import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'

export default function Login({ onLoggedIn }){
  const navigate = useNavigate()
  const [form, setForm] = useState({ username:'', password:'' })

  const submit = async (e) => {
    e.preventDefault()
    try{
      console.log('Attempting login with:', form);
      const response = await login(form)
      console.log('Login response:', response);
      const { token, role, name } = response
      localStorage.setItem('token', token)
      try { 
        localStorage.setItem('user', JSON.stringify({ role, name })); 
        console.log('User data saved to localStorage');
      } catch (error) {
        console.error('Error saving user data to localStorage:', error);
      }
      onLoggedIn({ role, name })
      navigate('/cim/Dashboard')
    }catch(e){ 
      console.error('Login error:', e);
      alert(e?.response?.data?.error || e?.message || 'Login failed') 
    }
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