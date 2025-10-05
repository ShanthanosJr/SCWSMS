import http from './http'

export const login = async (payload) => {
  console.log('Making login request with payload:', payload);
  try {
    const response = await http.post('/auth/login', payload);
    console.log('Login API response:', response);
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

export const registerUser = (payload) => http.post('/auth/register', payload).then(r=>r.data)