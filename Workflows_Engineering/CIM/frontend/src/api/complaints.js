import http from './http'
export const listComplaints = (params={}) => http.get('/complaints', { params }).then(r=>r.data)
export const createComplaint = (payload) => http.post('/complaints', payload).then(r=>r.data)
export const getByTicket = (ticket) => http.get(`/complaints/ticket/${ticket}`).then(r=>r.data)
export const updateComplaint = (id, payload) => http.patch(`/complaints/${id}`, payload).then(r=>r.data)
