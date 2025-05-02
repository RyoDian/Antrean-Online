// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.get('http://localhost:5000/api/logout', { withCredentials: true });
      setUser(null);
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  useEffect(() => {
    const fetchLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/loginStatus', { withCredentials: true });
        if (response.data.loggedIn) {
          setUser(response.data.user);
          console.log(response.data)
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching login status:', error);
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    fetchLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
