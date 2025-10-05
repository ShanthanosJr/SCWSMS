import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Login from './auth/Login'
import Register from './auth/Register'
import SearchBar from './components/SearchBar'
import { listSchedules, createSchedule, postResult, getAlerts, deleteSchedule } from './api/inspections'
import { listComplaints, createComplaint, updateComplaint, getByTicket } from './api/complaints'
import { getCompliance, getRecurring, getComplaintStats, recompute } from './api/analytics'
import { downloadInspectionPdf, downloadComplaintPdf } from './api/reports'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'

function decode(token){
  try{
    const b64 = token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')
    return JSON.parse(atob(b64))
  }catch{ return null }
}

const Card = ({ icon, title, value, sub }) => (
  <div className="col-md-3 mb-3">
    <div className="card card-cta">
      <div className="card-body d-flex align-items-center">
        <i className={`fa-solid ${icon} text-primary fs-3 me-2`}></i>
        <div>
          <div className="fw-semibold">{title}</div>
          <div className="fs-4 fw-bold">{value}</div>
          <div className="text-secondary small">{sub}</div>
        </div>
      </div>
    </div>
  </div>
)

function Dashboard(){
  const [stats, setStats] = useState({ total:0, upcoming:0, overdue:0, completed:0 })
  const [trend, setTrend] = useState([])
  const [complaintStats, setComplaintStats] = useState({ byType:[], byStatus:[] })

  useEffect(() => {
    getAlerts().then(setStats).catch(()=>setStats({ total:0, upcoming:0, overdue:0, completed:0 }))
    getCompliance({}).then(setTrend).catch(()=>setTrend([]))
    getComplaintStats().then(setComplaintStats).catch(()=>setComplaintStats({ byType:[], byStatus:[] }))
  }, [])

  return (
    <div className="container py-4">
      <div className="row">
        <Card icon="fa-calendar-check" title="Total" value={stats.total} sub="All inspections"/>
        <Card icon="fa-bell" title="Upcoming (24h)" value={stats.upcoming} sub="Reminders due"/>
        <Card icon="fa-triangle-exclamation" title="Overdue" value={stats.overdue} sub="Action needed"/>
        <Card icon="fa-clipboard-check" title="Completed" value={stats.completed} sub="Done"/>
      </div>
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <strong>Compliance Trend</strong>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => recompute().then(() => getCompliance({}).then(setTrend)).catch(()=>{})}
              >
                <i className="fa-solid fa-rotate me-1"></i>Refresh
              </button>
            </div>
            <div className="card-body" style={{height:320}}>
              {trend?.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={d=>new Date(d.date).toLocaleDateString()} />
                    <YAxis domain={[0,100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#0d6efd" strokeWidth={3}/>
                  </LineChart>
                </ResponsiveContainer>
              ) : <div className='text-secondary'>No data yet.</div>}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-header"><strong>Complaint Types</strong></div>
            <div className="card-body" style={{height:160}}>
              {complaintStats.byType?.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complaintStats.byType.map(x=>({ type:x._id, count:x.count }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0d6efd" />
                  </BarChart>
                </ResponsiveContainer>
              ) : <div className='text-secondary'>No data yet.</div>}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><strong>Complaint Status</strong></div>
            <div className="card-body" style={{height:160}}>
              {complaintStats.byStatus?.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complaintStats.byStatus.map(x=>({ status:x._id, count:x.count }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#198754" />
                  </BarChart>
                </ResponsiveContainer>
              ) : <div className='text-secondary'>No data yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Inspections({ role }){
  const [list, setList] = useState([])
  const [form, setForm] = useState({ project:'', area:'', inspector:'', dueAt:'', notes:'' })
  const [q, setQ] = useState('')

  // ensure this does not return a Promise to React
  const refresh = () => {
    listSchedules({ q })
      .then(setList)
      .catch(() => setList([]))
  }

  useEffect(() => { refresh() }, [q, refresh])

  const submit = (e) => {
    e.preventDefault()
    if(!form.area || !form.inspector || !form.dueAt) return alert('Fill required fields')
    createSchedule(form)
      .then(() => { setForm({ project:'', area:'', inspector:'', dueAt:'', notes:'' }); refresh() })
      .catch(err => alert(err?.response?.data?.error || 'Failed to create schedule'))
  }

  const complete = (id, outcome) =>
    postResult(id, { outcome, score: outcome==='PASS'?100:60 })
      .then(refresh)
      .catch(err => alert(err?.response?.data?.error || 'Failed to record result'))

  const remove = (id) => {
    if(!window.confirm('Delete this PASSED schedule?')) return
    deleteSchedule(id)
      .then(refresh)
      .catch(e => alert(e?.response?.data?.error || 'Delete failed'))
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0"><i className="fa-solid fa-list-check me-2"></i>Inspection Schedules</h5>
        <SearchBar placeholder="Search project/area/inspector…" onSearch={setQ}/>
      </div>

      {role==='ADMIN' && (
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header"><strong>Create Inspection Schedule</strong></div>
            <div className="card-body">
              <form onSubmit={submit}>
                <div className="mb-2">
                  <label className="form-label">Project</label>
                  <input className="form-control" value={form.project} onChange={e=>setForm({...form, project:e.target.value})}/>
                </div>
                <div className="mb-2">
                  <label className="form-label">Area</label>
                  <input className="form-control" value={form.area} onChange={e=>setForm({...form, area:e.target.value})}/>
                </div>
                <div className="mb-2">
                  <label className="form-label">Inspector</label>
                  <input className="form-control" value={form.inspector} onChange={e=>setForm({...form, inspector:e.target.value})}/>
                </div>
                <div className="mb-2">
                  <label className="form-label">Due At</label>
                  <input type="datetime-local" className="form-control" value={form.dueAt} onChange={e=>setForm({...form, dueAt:e.target.value})}/>
                </div>
                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" rows="2" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}></textarea>
                </div>
                <button className="btn btn-primary w-100">
                  <i className="fa-solid fa-floppy-disk me-2"></i>Save
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Project</th><th>Area</th><th>Inspector</th><th>Due</th><th>Status</th><th>Result</th><th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(row => (
                    <tr key={row._id}>
                      <td>{row.project}</td>
                      <td>{row.area}</td>
                      <td>{row.inspector}</td>
                      <td>{new Date(row.dueAt).toLocaleString()}</td>
                      <td><span className={`status-${row.status}`}>{row.status}</span></td>
                      <td>{row?.result?.outcome || '-'}</td>
                      <td className="text-end">
                        {row.status!=='COMPLETED' && <>
                          <button className="btn btn-sm btn-success me-1" onClick={()=>complete(row._id,'PASS')}>
                            <i className="fa-solid fa-check"></i>
                          </button>
                          <button className="btn btn-sm btn-danger me-1" onClick={()=>complete(row._id,'FAIL')}>
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </>}
                        {row?.result?.outcome==='PASS' && (
                          <>
                            <button className="btn btn-sm btn-outline-secondary me-1" onClick={()=>downloadInspectionPdf(row._id)}>
                              <i className="fa-solid fa-file-pdf me-1"></i>PDF
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={()=>remove(row._id)}>
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>)}
      {role!=='ADMIN' && <div className="alert alert-info">Workers do not manage inspections.</div>}
    </div>
  )
}

function Chatbot({ onClose, onSubmitted }){
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    area:'', type:'', complainantName:'', complainantId:'', mobile:'', description:'', photoUrl:''
  })

  const valid = () =>
    form.area && form.type && /^[A-Za-z\s.'-]+$/.test(form.complainantName||'') &&
    form.complainantId && /^\d{10}$/.test(form.mobile||'') && form.description

  const submit = () => {
    if (!valid()) return alert('Please fill all fields correctly. Name letters only; Mobile 10 digits.')
    createComplaint(form).then(()=>{ onSubmitted(); onClose(); }).catch(()=>alert('Failed to submit'))
  }

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100" style={{background:'rgba(0,0,0,.4)'}}>
      <div className="position-absolute bottom-0 end-0 m-3" style={{width:380}}>
        <div className="card shadow-lg">
          <div className="card-header d-flex justify-content-between align-items-center">
            <strong><i className="fa-solid fa-robot me-2"></i>Smart Complaint Chatbot</strong>
            <button className="btn btn-sm btn-outline-secondary" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
          </div>
          <div className="card-body">
            {step===1 && <>
              <div className="mb-2">
                <label className="form-label">Project/Area</label>
                <input className="form-control" value={form.area} onChange={e=>setForm({...form, area:e.target.value})}/>
              </div>
              <div className="mb-3">
                <label className="form-label">Type</label>
                <div className="d-flex gap-2">
                  {['SAFETY','QUALITY','DELAY','OTHER'].map(t=> (
                    <button key={t} type="button"
                      className={`btn btn-sm ${form.type===t?'btn-primary':'btn-outline-primary'}`}
                      onClick={()=>setForm({...form, type:t})}
                    >{t}</button>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary w-100" onClick={()=>setStep(2)}>Next</button>
            </>}
            {step===2 && <>
              <div className="mb-2">
                <label className="form-label">Name</label>
                <input className="form-control" value={form.complainantName} onChange={e=>setForm({...form, complainantName:e.target.value})} placeholder="letters only"/>
              </div>
              <div className="mb-2">
                <label className="form-label">ID Number</label>
                <input className="form-control" value={form.complainantId} onChange={e=>setForm({...form, complainantId:e.target.value})}/>
              </div>
              <div className="mb-2">
                <label className="form-label">Mobile (10 digits)</label>
                <input className="form-control" value={form.mobile} onChange={e=>setForm({...form, mobile:e.target.value})} maxLength={10}/>
              </div>
              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Image URL (optional)</label>
                <input className="form-control" value={form.photoUrl} onChange={e=>setForm({...form, photoUrl:e.target.value})}/>
              </div>
              <button className="btn btn-success w-100" onClick={submit}>
                <i className="fa-solid fa-paper-plane me-2"></i>Submit
              </button>
            </>}
          </div>
        </div>
      </div>
    </div>
  )
}

function Complaints({ role }){
  const [list, setList] = useState([])
  const [showBot, setShowBot] = useState(false)
  const [trackId, setTrackId] = useState('')
  const [tracked, setTracked] = useState(null)
  const [q, setQ] = useState('')

  const refresh = () => {
    listComplaints({ q })
      .then(setList)
      .catch(() => setList([]))
  }
  useEffect(() => { refresh() }, [q])

  const setStatus = (id, status) =>
    updateComplaint(id, { status }).then(refresh).catch(()=>alert('Update failed'))

  const track = () =>
    getByTicket(trackId).then(setTracked).catch(()=>setTracked(null))

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0"><i className="fa-solid fa-clipboard-list me-2"></i>Complaints</h5>
        <SearchBar placeholder="Search ticket/area/name/type…" onSearch={setQ}/>
      </div>

      {tracked && <div className="alert alert-info">Complaint <strong>{tracked.ticket}</strong> is currently <strong>{tracked.status}</strong>.</div>}

      <div className="card mb-2 p-2">
        <div className="d-flex align-items-center">
          
          {role==='WORKER' && (
            <button className="btn btn-primary btn-sm" onClick={()=>setShowBot(true)}>
              <i className="fa-solid fa-message me-2"></i>Log via Chatbot
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr><th>Ticket</th><th>Complainant</th><th>Area</th><th>Type</th><th>Status</th><th>Assignee</th><th className="text-end">Actions</th></tr>
            </thead>
            <tbody>
            {list.map(c=>(
              <tr key={c._id}>
                <td className="fw-semibold">{c.ticket}</td>
                <td>{c.complainantName}</td>
                <td>{c.area}</td>
                <td>{c.type}</td>
                <td>
                  <span className={`status-${c.status}`}>{c.status}</span>
                  {c.escalated && <span className="badge text-bg-danger ms-2">Escalated</span>}
                </td>
                <td>{c.assignee || '-'}</td>
                <td className="text-end">
                  {role==='ADMIN' ? (
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-secondary" onClick={()=>setStatus(c._id,'IN_PROGRESS')}>In-Progress</button>
                      <button className="btn btn-outline-success" onClick={()=>setStatus(c._id,'RESOLVED')}>Resolve</button>
                      <button className="btn btn-outline-secondary" onClick={()=>downloadComplaintPdf(c._id)}>
                        <i className="fa-solid fa-file-pdf"></i>
                      </button>
                    </div>
                  ) : <span className="text-secondary small">View only</span>}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>

      {role==='WORKER' && showBot && <Chatbot onClose={()=>setShowBot(false)} onSubmitted={refresh} />}
      {role==='ADMIN' && <div className="text-secondary small mt-2">Admins can manage complaints but cannot lodge them.</div>}
    </div>
  )
}

function Guide(){
  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header"><strong>Customer View — How our Inspection & Complaint Handling Works</strong></div>
        <div className="card-body">
          <ol className="mb-3">
            <li>Inspections are scheduled by Admin (project, area, inspector, due time).</li>
            <li>Inspector completes the check; results are recorded as PASS/FAIL.</li>
            <li>Workers can report issues via the Complaint Chatbot (Safety/Quality/Delay/Other).</li>
            <li>Each complaint gets a ticket (e.g., CMP-2025-1001) and status is tracked until Resolution.</li>
          </ol>
          <p className="mb-0">For audit purposes, PDF reports with our letterhead and signature space can be generated for both inspections and complaints.</p>
        </div>
      </div>
    </div>
  )
}

function CimModule(){
  const location = useLocation()
  const navigate = useNavigate()
  
  const [user, setUser] = useState(()=>{
    try{
      const u = localStorage.getItem('user'); 
      console.log('User from localStorage:', u);
      if (u) {
        const parsedUser = JSON.parse(u);
        console.log('Parsed user:', parsedUser);
        return parsedUser;
      }
      const t = localStorage.getItem('token'); 
      console.log('Token from localStorage:', t);
      const d = t? decode(t): null
      console.log('Decoded token:', d);
      return d ? { role:d.role, name:d.name } : null
    }catch(error){ 
      console.error('Error parsing user data:', error);
      return null 
    }
  })

  const readPage = () => {
    // Extract page from the current location path
    // Remove the /cim prefix and get the actual page
    const path = location.pathname.replace('/cim/', '').split('/')[0] || 'Complaints';
    return ['Dashboard','Inspections','Complaints','Analytics','Guide','Login', 'Register'].includes(path) ? path : 'Complaints';
  }
  
  const [page, setPage] = useState(readPage())

  useEffect(() => {
    setPage(readPage())
  }, [location])

  useEffect(() => {
    try{ if(user) localStorage.setItem('user', JSON.stringify(user)); }catch{}
  }, [user])

  const logout = () => { 
    try{ 
      localStorage.removeItem('token'); 
      localStorage.removeItem('user'); 
    }catch{}; 
    setUser(null); 
    navigate('/cim/Login')
  }

  const role = user?.role // ADMIN or WORKER
  const allowed = role==='ADMIN'
    ? ['Dashboard','Inspections','Complaints','Analytics']
    : ['Complaints','Guide']

  // Handle authentication redirects
  useEffect(() => {
    if (!user && page !== 'Login' && page !== 'Register') {
      navigate('/cim/Login')
    } else if (user && (page === 'Login' || page === 'Register')) {
      navigate(`/cim/${allowed[0]}`)
    }
  }, [user, page, navigate, allowed])

  // Redirect if trying to access unauthorized page
  useEffect(() => {
    if (user && !allowed.includes(page)) {
      navigate(`/cim/${allowed[0]}`)
    }
  }, [page, navigate, allowed, user])

  // Show login/register pages for unauthenticated users
  if (!user) {
    return (
      <Routes>
        <Route path="/Login" element={<Login onLoggedIn={setUser} />} />
        <Route path="/Register" element={<Register />} />
        <Route path="*" element={<Login onLoggedIn={setUser} />} />
      </Routes>
    )
  }

  return (
    <>
      <Navbar page={page} user={user} onLogout={logout} />
      <Routes>
        <Route path="/Dashboard" element={role==='ADMIN' ? <Dashboard /> : <div>Unauthorized</div>} />
        <Route path="/Inspections" element={role==='ADMIN' ? <Inspections role={role} /> : <div>Unauthorized</div>} />
        <Route path="/Complaints" element={<Complaints role={role} />} />
        <Route path="/Analytics" element={role==='ADMIN' ? <Analytics /> : <div>Unauthorized</div>} />
        <Route path="/Guide" element={<Guide />} />
        <Route path="/" element={<Complaints role={role} />} />
        <Route path="*" element={<Complaints role={role} />} />
      </Routes>
    </>
  )
}

function Analytics(){
  const [trend, setTrend] = useState([])
  const [recurring, setRecurring] = useState([])

  useEffect(() => {
    getCompliance({}).then(setTrend).catch(()=>setTrend([]))
    getRecurring({}).then(setRecurring).catch(()=>setRecurring([]))
  }, [getCompliance, getRecurring])

  return (
    <div className="container py-4">
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between">
          <strong>Compliance Trend</strong>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => recompute().then(()=>getCompliance({}).then(setTrend)).catch(()=>{})}
          >
            <i className="fa-solid fa-rotate me-1"></i>Refresh
          </button>
        </div>
        <div className="card-body" style={{height:320}}>
          {trend?.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={d=>new Date(d.date).toLocaleDateString()} />
                <YAxis domain={[0,100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#0d6efd" strokeWidth={3}/>
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="text-secondary">No data yet.</div>}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><strong>Recurring Issues (fails by area)</strong></div>
        <div className="table-responsive">
          <table className="table mb-0">
            <thead className="table-light"><tr><th>Area</th><th>Fails</th></tr></thead>
            <tbody>{recurring.map(r=>(
              <tr key={r.area}><td>{r.area}</td><td>{r.fails}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CimModule