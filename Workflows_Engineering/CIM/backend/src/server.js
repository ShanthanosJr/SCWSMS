require('dotenv').config();
const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 5003; // Changed from 4000 to 5003
http.createServer(app).listen(PORT, () => console.log(`Backend on http://localhost:${PORT}`));