require('dotenv').config();
const jwt = require('jsonwebtoken');

console.log('JWT_SECRET:', process.env.JWT_SECRET);

try {
  const token = jwt.sign({ id: 'test123' }, process.env.JWT_SECRET, { expiresIn: '30d' });
  console.log('Token generated successfully:', token);
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('Token verified successfully:', decoded);
} catch (error) {
  console.error('JWT Error:', error.message);
}