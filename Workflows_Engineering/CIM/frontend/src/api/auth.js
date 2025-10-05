import http from './http'
export const login = (payload) => http.post('/auth/login', payload).then(r=>r.data)
export const registerUser = (payload) => http.post('/auth/register', payload).then(r=>r.data)
