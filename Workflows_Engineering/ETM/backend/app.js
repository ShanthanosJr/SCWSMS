const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON requests

// MongoDB connection setup (directly in the code)
const DB_URI = 'mongodb+srv://Kavishka:vQSVBzYWHfOo7wa5@cluster0.6vdnmh3.mongodb.net/test?retryWrites=true&w=majority'; // Replace with your actual MongoDB URI

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello from the backend with MongoDB!');
});

// Importing routes

const toolRoutes = require('./routes/toolRoutes');
const rentalRoutes = require('./routes/rentalRoutes');

// Using routes
app.use('/api/tools', toolRoutes);
app.use('/api/rentals', rentalRoutes);

// Start server
const port = process.env.PORT || 5002; // Changed from 3005 to 5002
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
