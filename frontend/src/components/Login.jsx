import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = () => {
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

        try {
            const response = await authAPI.login({
                identifier: formData.email,
                password: formData.password,
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            navigate('/services');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            {/* LEFT SIDE - Form (Golden Gradient) */}
            <div className="login-form">
                <div className="form-content">
                    <h1>Welcome Back!</h1>
                    <h2>BeautyBook</h2>

                    {error && <div className="error-msg">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="enter your email"
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
                            {/* Keep this as a link to register */}
                            <Link to="/register" className="register-link">
                                Register her
                            </Link>
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="auth-footer-text">
                        Don't have account? <Link to="/register">Register her</Link>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - Image (Fixed to prevent collapse) */}
            <div className="login-image">
                <img 
                    src="/beautybook.png" 
                    alt="Beauty Salon" 
                    onError={(e) => { e.target.style.display='none'; }} // This hides the broken image icon
                />
            </div>
        </div>
    );
};

export default Login;