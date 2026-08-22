import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Appointments = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'confirmed', 'discount'
    const [cancellingId, setCancellingId] = useState(null);

    // 1. Fetch appointments
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/appointments', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAppointments(res.data.data);
            } catch (err) {
                console.error("Error fetching appointments", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    // 2. Fetch ALL services (To show them in the Discount tab)
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/services', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setServices(res.data.data);
            } catch (err) {
                console.error("Error fetching services", err);
            }
        };
        fetchServices();
    }, []);

    // 3. Function to cancel an appointment
    const handleCancelAppointment = async (app) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        setCancellingId(app._id);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/appointments/cancel/${app._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(prev => prev.map(item => 
                item._id === app._id ? { ...item, status: 'Cancelled' } : item
            ));
            alert("❌ Appointment cancelled.");
        } catch (err) {
            console.error("Error cancelling appointment", err);
            alert("Failed to cancel appointment.");
        } finally {
            setCancellingId(null);
        }
    };

    // 4. DISCOUNT LOGIC: Find services with 5+ confirmed appointments
    const getDiscountedServices = () => {
        const serviceCounts = {};
        appointments.forEach(app => {
            const serviceId = app.service?._id || app.service;
            if (serviceId) {
                if (!serviceCounts[serviceId]) {
                    serviceCounts[serviceId] = { count: 0, confirmedCount: 0 };
                }
                serviceCounts[serviceId].count += 1;
                if (app.status === 'Confirmed') {
                    serviceCounts[serviceId].confirmedCount += 1;
                }
            }
        });

        return services.filter(service => {
            const data = serviceCounts[service._id];
            return data && data.count >= 5 && data.confirmedCount >= 5;
        });
    };

    const discountedServices = getDiscountedServices();

    // 5. Filter appointments for All/Confirmed tabs
    const filteredAppointments = appointments.filter(app => {
        if (activeTab === 'all') return true;
        if (activeTab === 'confirmed') return app.status === 'Confirmed';
        return true;
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="appointments-page">
            <nav className="appointments-navbar">
                <div className="nav-logo">BeautyBook</div>
                <div className="nav-links-desktop">
                    {/* Icons */}
                    <span className={`nav-item ${isActive('/services') ? 'active' : ''}`} onClick={() => navigate('/services')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                            <path d="M12 2.69l5.19 5.2 7.48-1.65-2.17 8.59 7.41 4.2-5.19 5.2-7.48 1.65-4.2-7.41-7.41-4.2 2.17-8.59L12 2.69z"/>
                            <path d="M12 22V2"/>
                        </svg>
                        Beauty treatments
                    </span>
                    <span className={`nav-item ${isActive('/appointments') ? 'active' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                            <line x1="12" y1="14" x2="12" y2="18"></line>
                            <line x1="16" y1="14" x2="16" y2="18"></line>
                        </svg>
                        Appointment
                    </span>
                    <span className="nav-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                    </span>
                    <span className="nav-icon" onClick={handleLogout} style={{cursor: 'pointer'}}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                    </span>
                </div>
            </nav>

            <div className="appointments-content">
                {/* --- FILTER PILLS --- */}
                <div className="filter-pills">
                    <button className={`pill ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All appointment</button>
                    <button className={`pill ${activeTab === 'confirmed' ? 'active' : ''}`} onClick={() => setActiveTab('confirmed')}>Appointment confirmed</button>
                    <button className={`pill ${activeTab === 'discount' ? 'active' : ''}`} onClick={() => setActiveTab('discount')}>Discount offer</button>
                </div>

                {/* --- DISCOUNT TAB: Show GRID of discounted services (like Services page) --- */}
                {activeTab === 'discount' && (
                    <div className="services-grid-container">
                        <div className="services-grid">
                            {discountedServices.length === 0 ? (
                                <div className="empty-appointments-card" style={{ gridColumn: '1 / -1' }}>
                                    <h3>No discounts available yet</h3>
                                    <p>Book 5 appointments for the same service to unlock a 15% discount!</p>
                                </div>
                            ) : (
                                discountedServices.map((service) => (
                                    <div key={service._id} className="service-card discount-service-card">
                                        {/* Show 15% tag */}
                                        <div className="discount-tag">15%</div>
                                        
                                        <div className="service-image-wrapper">
                                            <img src={service.image} alt={service.name} className="service-image" />
                                        </div>
                                        <h3 className="service-title">{service.name}</h3>
                                        <div className="service-details">
                                            <span>Durée: {service.duration} min</span>
                                            <span>Prix: {service.price} DA</span>
                                        </div>
                                        <button className="service-btn" onClick={() => navigate('/services')}>Book again</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* --- APPOINTMENT LIST (For All & Confirmed Tabs) --- */}
                {activeTab !== 'discount' && (
                    loading ? (
                        <div className="loading">Loading your appointments...</div>
                    ) : (
                        <div className="appointments-list">
                            {filteredAppointments.length === 0 ? (
                                <div className="empty-appointments-card">
                                    <h3>🗓️ No appointments here</h3>
                                    <p>Go to Beauty treatments to book your first one!</p>
                                </div>
                            ) : (
                                filteredAppointments.map((app) => (
                                    <div key={app._id} className="appointment-card">
                                        <div className="card-image">
                                            <img src={app.service?.image || "/default.jpg"} alt={app.service?.name} />
                                        </div>
                                        <div className="card-details">
                                            <h3 className="card-title">{app.service?.name || "Unknown Service"}</h3>
                                            <div className="card-meta">
                                                <span>prix : {app.price} DA</span>
                                                <span>Duration : {app.service?.duration || "N/A"}</span>
                                                <span>Date : {formatDate(app.appointmentDate)}</span>
                                                <span>Time : {app.startTime} - {app.endTime}</span>
                                            </div>
                                        </div>
                                        <div className="card-actions">
                                            {/* ONLY show cancel button if not Completed or Cancelled */}
                                            {app.status !== 'Completed' && app.status !== 'Cancelled' && (
                                                <button 
                                                    className="cancel-btn" 
                                                    onClick={() => handleCancelAppointment(app)}
                                                    disabled={cancellingId === app._id}
                                                >
                                                    {cancellingId === app._id ? 'Cancelling...' : 'Cancel Appointment if you want'}
                                                </button>
                                            )}
                                            <div className="status-badge">
                                                {app.status === 'Pending' ? 'Pending Confirmation' : app.status}
                                                <span className={`status-dot ${app.status === 'Pending' ? 'yellow' : app.status === 'Confirmed' ? 'green' : app.status === 'Completed' ? 'blue' : 'red'}`}></span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Appointments;