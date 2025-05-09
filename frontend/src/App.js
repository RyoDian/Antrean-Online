// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import UserQueuePage from './pages/UserQueuePage';
import AdminQueuePage from './pages/AdminQueuePage';
import LocationPage from './pages/LocationPage';
import ServicePage from './pages/ServicePage';
import ProtectedRoute from './components/ProtectedRoutes';
import SuperAdminPage from './pages/SuperAdminPage';
import PageNotFound from './PageNotFound';
import RegisterPage from './pages/RegisterPage';
import PublicRoute from './components/PublicRoute';
import EditLocationPage from './pages/EditLocationPage';
import AddLocationPage from './pages/AddLocationPage';
import AddServicePage from './pages/AddServicePage';
import EditServicePage from './pages/EditServicePage';
import AdminComPage from './pages/AdminComPage';
import AddAdminPage from './pages/AddAdminPage';
import EditAdminPage from './pages/EditAdminPage';
import MyQueuePage from './pages/MyQueuePage';
import AllQueue from './pages/allQueue';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Login Route */}
          <Route element={<PublicRoute/>} >
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          </Route>
          
          {/* User Routes */}
          <Route element={<ProtectedRoute roles={['user']} />}>
            <Route path="/dashboard" element={<UserQueuePage />} />
            <Route path="/queue" element={<MyQueuePage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute roles={['admin', 'super-admin']} />}>
            <Route path="/A-dashboard" element={<AdminQueuePage />} />
            <Route path="/allQueue" element={<AllQueue />} />
          </Route>

          {/* Super Admin Routes */}
          <Route element={<ProtectedRoute roles={['super-admin']} />}>
            <Route path="/S-dashboard" element={<SuperAdminPage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/location/add" element={<AddLocationPage />} />
            <Route path="/location/:id" element={<EditLocationPage />} />
            <Route path="/service" element={<ServicePage />} />
            <Route path="/service/add" element={<AddServicePage />} />
            <Route path="/service/:id" element={<EditServicePage />} />
            <Route path="/admin" element={<AdminComPage />} />
            <Route path="/admin/add" element={<AddAdminPage />} />
            <Route path="/admin/:id" element={<EditAdminPage />} />
          </Route>

          {/* Fallback Route for Page Not Found */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
