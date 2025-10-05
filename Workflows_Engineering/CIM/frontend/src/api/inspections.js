// frontend/src/api/inspections.js
import http from './http'

// GET /api/inspections/schedules?q=
export const listSchedules = async ({ q } = {}) => {
  const { data } = await http.get('/inspections/schedules', { params: { q } })
  return Array.isArray(data) ? data : []
}

// POST /api/inspections/schedules
export const createSchedule = async (payload) => {
  const { data } = await http.post('/inspections/schedules', payload)
  return data
}

// POST /api/inspections/schedules/:id/result
export const postResult = async (id, payload) => {
  const { data } = await http.post(`/inspections/schedules/${id}/result`, payload)
  return data
}

// DELETE /api/inspections/schedules/:id
export const deleteSchedule = async (id) => {
  const { data } = await http.delete(`/inspections/schedules/${id}`)
  return data
}

// GET /api/inspections/alerts
export const getAlerts = async () => {
  const { data } = await http.get('/inspections/alerts')
  return data || { total:0, upcoming:0, overdue:0, completed:0 }
}
