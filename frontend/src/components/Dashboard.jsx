import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await authAPI.getMe();
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user:', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        getUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard">
            <h1>Welcome to BeautyBook! ✨</h1>
            {user && (
                <div className="user-info">
                    <p>Welcome, {user.fullName}!</p>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                    <p>Loyalty Points: {user.loyaltyPoints}</p>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;