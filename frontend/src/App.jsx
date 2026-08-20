import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Services from './components/Services'; 
import Appointments from './components/Appointments'; 


// Protected Route
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Change /dashboard to /services */}
                    <Route path="/services" element={
                        <ProtectedRoute>
                            <Services />
                        </ProtectedRoute>
                    } />
                     {/* Add the Appointments Route */}
                    <Route path="/appointments" element={
                        <ProtectedRoute>
                            <Appointments />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;