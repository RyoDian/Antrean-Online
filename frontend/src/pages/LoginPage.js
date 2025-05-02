// src/components/Login.js
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { setUser, setIsLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const redirectBasedOnRole = useCallback(
    (role) => {
      if (role === 'admin') {
        navigate('/A-dashboard');
      } else if (role === 'super-admin') {
        navigate('/S-dashboard');
      } else if (role === 'user') {
        navigate('/dashboard');
      }
    },
    [navigate]
  );

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.data) {
        setUser(response.data); // Set data pengguna dari respons login
        setIsLoggedIn(true);
        redirectBasedOnRole(response.data.role);
      } else {
        setError('Login berhasil, tetapi data pengguna tidak tersedia.');
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col justify-center sm:py-12 px-6 lg:px-8"
      style={{ backgroundImage: `url("/bg1.webp")` }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div class="flex justify-center items-center">
             <img src='/logo.png' alt='Logo' class="w-4/6" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-blue-500">LOGIN</h2>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input id="email" name="email" type="text" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full px-3 py-2 border rounded-md" />
            </div>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <div>
              <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md">MASUK</button>
              <p className="text-center mt-4">Belum Punya Account? <a href="/register" className="text-blue-600 hover:text-gray-600">Register Disini</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
