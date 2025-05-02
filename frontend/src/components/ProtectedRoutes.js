// src/components/ProtectedRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import PageNotFound from '../PageNotFound';

const ProtectedRoute = ({ roles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchLoginStatus = async () => {
      try {
        const response = await axios.get('/api/loginStatus', { withCredentials: true });
        if (response.data.loggedIn) {
          setUser(response.data.user);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching login status:', error);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoginStatus();
  }, []);

  // Show a loading indicator while fetching login status
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login page if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Show PageNotFound if user role doesn't match required roles
  if (roles && !roles.includes(user?.role)) {
    return <PageNotFound />;
  }

  // If login status and role match, render the protected route
  return <Outlet />;
};

export default ProtectedRoute;
