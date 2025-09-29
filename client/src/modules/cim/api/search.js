import http from './http'

export const suggest = async (q) => {
  const { data } = await http.get('/search/suggest', { params: { q } })
  return data
}
