import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'
})

// attach JWT if present
http.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// handle 401s globally → clear session, go to Login
http.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } catch {}
      if (location.hash !== '#/Login') location.hash = '#/Login'
    }
    return Promise.reject(err)
  }
)

export default http
