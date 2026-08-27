import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        secretKey: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

// AdminRegister.jsx
const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match!');
        return;
    }
    
    // SECRET KEY CHECK
    if (formData.secretKey !== 'ADMIN_SECRET_2024') {
        setError('Invalid secret key!');
        return;
    }

    setLoading(true);
    setError('');

    try {
        console.log('Registering admin:', formData.email); // DEBUG
        
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.email.split('@')[0],
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            role: 'admin' // ← THIS MUST BE 'admin'!
        });

        console.log('Registration response:', response.data);

        const { token, user } = response.data;
        
        // DEBUG: Check what role we got back
        console.log('User role from server:', user.role);
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Check role and redirect
        if (user.role === 'admin') {
            console.log('Redirecting to admin dashboard...');
            navigate('/admin/dashboard');
        } else {
            console.log('Redirecting to services (NOT admin)...'); // This shouldn't happen
            navigate('/services');
        }
    } catch (error) {
        console.error('Registration error:', error.response?.data);
        setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
        setLoading(false);
    }
};
    return (
        <div className="login-wrapper">
            <div className="login-form">
                <div className="form-content">
                    <h1>Create Admin Account</h1>
                    <h2>BeautyBook Admin</h2>

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
                            placeholder="enter your password"
                            required
                            disabled={loading}
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="confirm your password"
                            required
                            disabled={loading}
                        />

                        <input
                            type="password"
                            name="secretKey"
                            value={formData.secretKey}
                            onChange={handleChange}
                            placeholder="enter admin secret key"
                            required
                            disabled={loading}
                        />

                        <div className="register-bottom-row">
                            <Link to="/admin-login" className="register-login-link">
                                Already have admin account?
                            </Link>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Admin'}
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

export default AdminRegister;