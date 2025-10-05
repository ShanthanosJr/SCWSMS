import axios from 'axios'

const http = axios.create({
  baseURL: process.env.REACT_APP_CIM_API_BASE_URL || 'http://localhost:5003/api'
})

console.log('CIM API Base URL:', http.defaults.baseURL);

// attach JWT if present
http.interceptors.request.use(cfg => {
  console.log('Making request to:', cfg);
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// handle 401s globally → clear session, go to Login
http.interceptors.response.use(
  (r) => {
    console.log('Response received:', r);
    return r;
  },
  (err) => {
    console.error('API Error:', err);
    if (err?.response?.status === 401) {
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } catch {}
      // Note: This might not work in all contexts, but we'll keep it for now
    }
    return Promise.reject(err)
  }
)

export default http