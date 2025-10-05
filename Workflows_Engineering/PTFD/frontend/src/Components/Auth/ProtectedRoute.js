import React from 'react';
import { Navigate } from 'react-router-dom';

// Enhanced authentication check
const isAuthenticated = () => {
  // Check if there's a user and token in localStorage
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  // For demo purposes, we'll check if there's a user in localStorage
  // In a real application, you would check for a valid JWT token
  return user !== null && token !== null;
};

const ProtectedRoute = ({ children }) => {
  // If user is not authenticated, redirect to sign in page
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }

  // If user is authenticated, render the protected component
  return children;
};

export default ProtectedRoute;