// src/components/PublicRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
  const { user } = useAuth();

  // Jika pengguna sudah login, arahkan mereka ke halaman berdasarkan perannya
  if (user) {
    const { role } = user;

    if (role === 'admin') {
      return <Navigate to="/A-dashboard" replace />;
    } else if (role === 'super-admin') {
      return <Navigate to="/S-dashboard" replace />;
    } else if (role === 'user') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Jika pengguna belum login, tampilkan komponen anak (halaman login atau register)
  return <Outlet />;
};

export default PublicRoute;
