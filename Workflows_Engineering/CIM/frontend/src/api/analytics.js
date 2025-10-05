import http from './http'
export const getCompliance = (params={}) => http.get('/analytics/compliance', { params }).then(r=>r.data)
export const getRecurring = (params={}) => http.get('/analytics/recurring', { params }).then(r=>r.data)
export const getComplaintStats = () => http.get('/analytics/complaint-stats').then(r=>r.data)
export const recompute = () => http.post('/analytics/recompute').then(r=>r.data)
