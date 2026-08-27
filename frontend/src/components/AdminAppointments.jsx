import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const AdminAppointments = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Check if user is admin
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.role !== 'admin') {
                navigate('/services');
                return;
            }
        }

        fetchAppointments();
    }, [navigate]);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/appointments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(res.data.data || []);
        } catch (err) {
            console.error("Error fetching appointments:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/appointments/confirm/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("✅ Appointment confirmed!");
            fetchAppointments();
        } catch (err) {
            console.error("Error confirming appointment:", err);
            alert("❌ Failed to confirm appointment.");
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/appointments/cancel/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("❌ Appointment cancelled.");
            fetchAppointments();
        } catch (err) {
            console.error("Error cancelling appointment:", err);
            alert("❌ Failed to cancel appointment.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Fixed: was removeUser()
        navigate('/admin-login'); // Goes to admin login page
    };

    const isActive = (path) => location.pathname === path;
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const filteredAppointments = appointments.filter(app => {
        if (filter === 'all') return true;
        if (filter === 'pending') return app.status === 'Pending';
        if (filter === 'confirmed') return app.status === 'Confirmed';
        if (filter === 'completed') return app.status === 'Completed';
        if (filter === 'cancelled') return app.status === 'Cancelled';
        return true;
    });

    return (
        <div className="admin-page">
            <nav className="admin-navbar">
                <div className="nav-logo">BeautyBook Admin</div>
                <div className="nav-links-desktop">
                    <span className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`} onClick={() => navigate('/admin/dashboard')}>
                        📊 Dashboard
                    </span>
                    <span className={`nav-item ${isActive('/admin/appointments') ? 'active' : ''}`}>
                        📅 Appointments
                    </span>
                    <span className={`nav-item ${isActive('/admin/services') ? 'active' : ''}`} onClick={() => navigate('/admin/services')}>
                        💅 Services
                    </span>
                    <span className={`nav-item ${isActive('/admin/clients') ? 'active' : ''}`} onClick={() => navigate('/admin/clients')}>
                        👤 Clients
                    </span>
                    <span className="nav-item" onClick={handleLogout} style={{cursor: 'pointer', color: '#d32f2f'}}>
                        🚪 Logout
                    </span>
                </div>
            </nav>

            <div className="admin-content">
                <h1 className="admin-welcome">Manage Appointments</h1>
                
                <div className="admin-filter-bar">
                    <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                    <button className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending</button>
                    <button className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`} onClick={() => setFilter('confirmed')}>Confirmed</button>
                    <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
                    <button className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`} onClick={() => setFilter('cancelled')}>Cancelled</button>
                </div>

                <div className="admin-table-wrapper">
                    {loading ? (
                        <p>Loading appointments...</p>
                    ) : filteredAppointments.length === 0 ? (
                        <p>No appointments found.</p>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Client</th>
                                    <th>Service</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.map((app) => (
                                    <tr key={app._id}>
                                        <td>{app.client?.firstName || 'Unknown'}</td>
                                        <td>{app.service?.name || 'Unknown'}</td>
                                        <td>{formatDate(app.appointmentDate)}</td>
                                        <td>{app.startTime} - {app.endTime}</td>
                                        <td>{app.price} DA</td>
                                        <td>
                                            <span className={`status-badge ${app.status.toLowerCase()}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="admin-actions">
                                            {app.status === 'Pending' && (
                                                <button className="confirm-btn" onClick={() => handleConfirm(app._id)}>
                                                    ✅ Confirm
                                                </button>
                                            )}
                                            {app.status !== 'Completed' && app.status !== 'Cancelled' && (
                                                <button className="cancel-btn" onClick={() => handleCancel(app._id)}>
                                                    ❌ Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAppointments;