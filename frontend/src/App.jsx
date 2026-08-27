import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import Register from './components/Register';
import Services from './components/Services'; 
import Appointments from './components/Appointments'; 
import Settings from './components/Settings';
import AdminDashboard from './components/AdminDashboard';
import AdminAppointments from './components/AdminAppointments';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/services" replace />;
    }
    
    return children;
};

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/admin-register" element={<AdminRegister />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Client Routes */}
                    <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
                    <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/appointments" element={<ProtectedRoute adminOnly={true}><AdminAppointments /></ProtectedRoute>} />
                    
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;