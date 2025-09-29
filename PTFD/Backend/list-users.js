require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./Model/UserModel');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://Kavishka:vQSVBzYWHfOo7wa5@cluster0.6vdnmh3.mongodb.net/test?retryWrites=true&w=majority")
  .then(async () => {
    console.log("Connected to MongoDB");
    
    try {
      const users = await User.find({});
      console.log("Users in database:", users.length);
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email})`);
      });
      
      mongoose.connection.close();
    } catch (error) {
      console.error("Error fetching users:", error.message);
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err.message);
  });