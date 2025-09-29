import http from './http'

function downloadBlob(response, filename){
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  window.URL.revokeObjectURL(url)
}

export const downloadInspectionPdf = async (id) => {
  const resp = await http.get(`/reports/inspection/${id}.pdf`, { responseType: 'blob' })
  downloadBlob(resp, `inspection-${id}.pdf`)
}

export const downloadComplaintPdf = async (id) => {
  const resp = await http.get(`/reports/complaint/${id}.pdf`, { responseType: 'blob' })
  downloadBlob(resp, `complaint-${id}.pdf`)
}
