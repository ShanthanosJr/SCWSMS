import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'

export default function Register(){
  const navigate = useNavigate()
  const [form, setForm] = useState({ username:'', password:'', name:'', birthdate:'', role:'WORKER' })
  const submit = async (e) => {
    e.preventDefault()
    try{ 
      await registerUser(form); 
      alert('Registered! You can now login.')
      // Navigate to login page after successful registration
      navigate('/cim/Login')
    }catch(e){ alert(e?.response?.data?.error || 'Registration failed') }
  }
  return (
    <div className="container d-flex justify-content-center align-items-center" style={{minHeight:'100vh'}}>
      <div className="card shadow-sm maxw-380 w-100">
        <div className="card-body">
          <h5 className="mb-3"><i className="fa-solid fa-user-plus me-2"></i>Register</h5>
          <form onSubmit={submit}>
            <div className="mb-2"><label className="form-label">Name</label><input className="form-control" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></div>
            <div className="mb-2"><label className="form-label">Birthdate</label><input type="date" className="form-control" value={form.birthdate} onChange={e=>setForm({...form, birthdate:e.target.value})}/></div>
            <div className="mb-2"><label className="form-label">Username</label><input className="form-control" value={form.username} onChange={e=>setForm({...form, username:e.target.value})}/></div>
            <div className="mb-2"><label className="form-label">Password</label><input type="password" className="form-control" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/></div>
            <div className="mb-3"><label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
                <option value="WORKER">Worker</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button className="btn btn-primary w-100">Register</button>
          </form>
        </div>
      </div>
    </div>
  )
}