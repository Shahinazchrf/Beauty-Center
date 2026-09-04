// AdminLogin.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        console.log('🔐 Admin login attempt:', formData.email);

        try {
            const response = await axios.post('https://beauty-center-h667.onrender.com/api/auth/login', {
                identifier: formData.email,
                password: formData.password
            });

            console.log('📩 Login response:', response.data);

            const { token, user } = response.data;
            
            // DEBUG: Check what role we get
            console.log('User role from server:', user.role);
            
            // Check if user is admin
            if (user.role !== 'admin') {
                setError('Access denied. Admin privileges required.');
                setLoading(false);
                return;
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            console.log('✅ Admin login successful! Redirecting to dashboard...');
            navigate('/admin/dashboard');
            
        } catch (error) {
            console.error('❌ Login error:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Invalid credentials');
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-form">
                <div className="form-content">
                    <h1>Welcome Back!</h1>
                    <h2>BeautyBook Admin</h2>

                    {error && <div className="error-msg">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="enter your admin email"
                            required
                            disabled={loading}
                        />

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="enter your Password"
                            required
                            disabled={loading}
                        />

                        <div className="form-row">
                            <label className="remember">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                Remember Me
                            </label>
                            <Link to="/forgot-password" className="register-link">
                                Forget Password?
                            </Link>
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <div className="auth-footer-text">
                        Don't have admin account? <Link to="/admin-register">Register here</Link>
                    </div>
                </div>
            </div>

            <div className="login-image">
                <img 
                    src="/beautybook.png" 
                    alt="Beauty Salon" 
                    onError={(e) => { e.target.style.display='none'; }}
                />
            </div>
        </div>
    );
};

export default AdminLogin;