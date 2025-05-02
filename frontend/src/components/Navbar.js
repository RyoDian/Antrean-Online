// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
   <nav style={{ 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between', 
  padding: '1rem 2rem', 
  borderBottom: '1px solid #ddd',
  position: 'sticky', 
  top: '0', 
  backgroundColor: '#424242', 
  zIndex: 1000
}}>
  {/* Logo - kiri */}
  <div className="flex justify-center items-center">
    <img src="/logo.png" alt="Logo" className="w-20" />
  </div>

  {/* Menu - tengah */}
  <div className="flex gap-8 justify-center items-center text-white">
    {user && user.role === 'admin' && <Link to="/A-Dashboard">Manage Queues</Link>}
    {user && user.role === 'super-admin' && <Link to="/S-Dashboard">Dashboard</Link>}
    {user && user.role === 'user' && <Link to="/dashboard">Home</Link>}
    {user && user.role === 'user' && <Link to="/queue">My Queue</Link>}
  </div>

  {/* Logout - kanan */}
  <div className='text-white'>
    <button onClick={logout}>Logout</button>
  </div>
</nav>
  );
};

export default Navbar;
