const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  deleteUser,
  getAllUsers, // Import the new function
  upload
} = require('../Controllers/UserController');
const { protect } = require('../Middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('avatar'), updateUserProfile);
router.delete('/profile', protect, deleteUser);
router.get('/', protect, getAllUsers); // Add route to get all users

module.exports = router;