import React from 'react';
import { useAuth } from './AuthContext'; // Import the useAuth hook
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedComponent = ({ children }) => {
  const { user } = useAuth(); // Get user from AuthContext
  const isLoggedIn = useSelector((state) => state.isLoggedIn); // Check logged-in status from Redux

  // Check authentication state
  const isAuthenticated = user || isLoggedIn;
  console.log(isAuthenticated)
  // If user is not authenticated, navigate to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected content if logged in
  return children;
};

export default ProtectedComponent;
