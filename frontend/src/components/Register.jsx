import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long!');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authAPI.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            navigate('/services');
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            {/* LEFT SIDE - Golden Box Form */}
            <div className="login-form">
                <div className="form-content">
                    
                    <h1>Create Your Account</h1>
                    <h2>BeautyBook</h2>

                    {error && <div className="error-msg">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="enter your First Name"
                            required
                            disabled={loading}
                        />

                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="enter your Last Name"
                            required
                            disabled={loading}
                        />

                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="enter your UserName"
                            required
                            disabled={loading}
                        />

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
                            placeholder="enter your password"
                            required
                            disabled={loading}
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="enter your password again"
                            required
                            disabled={loading}
                        />

                        <div className="register-bottom-row">
                            <Link to="/login" className="register-login-link">
                                Have an account?
                            </Link>
                            <button type="submit" disabled={loading}>
                                {loading ? '...' : 'Signup'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="login-image">
                <img src="/beautybook.png" alt="Beauty Salon" />
            </div>
        </div>
    );
};

export default Register;