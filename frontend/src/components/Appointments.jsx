import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const Appointments = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [cancellingId, setCancellingId] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    
    // NOTIFICATION STATES
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch appointments
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

    // Fetch services
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

    // ✅ FETCH NOTIFICATIONS (with auto-refresh every 30 seconds)
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/notifications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(res.data.data);
                
                // Count unread notifications
                const unread = res.data.data.filter(n => !n.isRead).length;
                setUnreadCount(unread);
                
                console.log('📬 Fetched notifications:', res.data.data);
            } catch (err) {
                console.error("Error fetching notifications", err);
            }
        };
        
        // Initial fetch
        fetchNotifications();
        
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        
        return () => clearInterval(interval);
    }, [appointments]); // Also refresh when appointments change

    // ✅ MARK AS READ FUNCTION
    const handleMarkAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/notifications/read/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Update state
            setNotifications(prev => prev.map(n => 
                n._id === id ? { ...n, isRead: true } : n
            ));
            
            // Update unread count
            setUnreadCount(prev => Math.max(0, prev - 1));
            
            console.log('✅ Marked notification as read:', id);
        } catch (err) {
            console.error("Error marking notification as read", err);
        }
    };

    // ✅ MARK ALL AS READ
    const handleMarkAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/notifications/read-all', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Update state
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            
            console.log('✅ All notifications marked as read');
        } catch (err) {
            console.error("Error marking all as read", err);
        }
    };

    // Cancel appointment
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

    // DISCOUNT LOGIC
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

    // Filter appointments
    const filteredAppointments = appointments.filter(app => {
        if (activeTab === 'all') return true;
        if (activeTab === 'confirmed') return app.status === 'Confirmed';
        return true;
    });

    const isActive = (path) => location.pathname === path;
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMin = Math.floor(diffMs / 60000);
        const diffHour = Math.floor(diffMs / 3600000);
        const diffDay = Math.floor(diffMs / 86400000);
        
        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin} minutes ago`;
        if (diffHour < 24) return `${diffHour} hours ago`;
        return `${diffDay} days ago`;
    };

    return (
        <div className="appointments-page">
            <nav className="appointments-navbar">
                <div className="nav-logo">BeautyBook</div>
                
                {/* Hamburger Menu for Mobile */}
                <div className="hamburger-icon" onClick={toggleMenu}>☰</div>

                <div className="nav-links-desktop">
                    {/* Icons */}
                    <span className={`nav-item ${isActive('/services') ? 'active' : ''}`} onClick={() => navigate('/services')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                            <path d="M12 2.69l5.19 5.2 7.48-1.65-2.17 8.59 7.41 4.2-5.19 5.2-7.48 1.65-4.2-7.41-7.41-4.2 2.17-8.59L12 2.69z"/>
                            <path d="M12 22V2"/>
                        </svg>
                        {t.beautyTreatments}
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
                        {t.appointment}
                    </span>
                    
                    {/* ✅ NOTIFICATION BELL */}
                    <span className="nav-icon" onClick={() => setShowNotifications(!showNotifications)} style={{position: 'relative', cursor: 'pointer'}}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        {unreadCount > 0 && (
                            <span className="notification-badge">
                                {unreadCount}
                            </span>
                        )}
                        {showNotifications && (
                            <div className="notification-dropdown">
                                <div className="notification-header">
                                    <h4>Notifications</h4>
                                    {unreadCount > 0 && (
                                        <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
                                            Mark all as read
                                        </button>
                                    )}
                                </div>
                                {notifications.length === 0 ? (
                                    <p className="no-notifications">No notifications</p>
                                ) : (
                                    notifications.map((notif) => (
                                        <div 
                                            key={notif._id} 
                                            className={`notification-item ${notif.isRead ? 'read' : 'unread'}`} 
                                            onClick={() => handleMarkAsRead(notif._id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="notification-icon">
                                                {notif.type === 'success' ? '✅' : notif.type === 'info' ? '📢' : notif.type === 'warning' ? '⚠️' : '❌'}
                                            </div>
                                            <div className="notification-content">
                                                <strong>{notif.title}</strong>
                                                <p>{notif.message}</p>
                                                <small>{timeAgo(notif.createdAt)}</small>
                                            </div>
                                            {!notif.isRead && <span className="unread-dot"></span>}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </span>

                    {/* Settings Gear (Navigate to Settings) */}
                    <span className="nav-icon" onClick={() => navigate('/settings')} style={{cursor: 'pointer'}}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                    </span>
                </div>
            </nav>

            {/* MOBILE MENU */}
            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    <span className={`mobile-nav-item ${isActive('/services') ? 'active' : ''}`} onClick={() => { setMenuOpen(false); navigate('/services'); }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                            <path d="M12 2.69l5.19 5.2 7.48-1.65-2.17 8.59 7.41 4.2-5.19 5.2-7.48 1.65-4.2-7.41-7.41-4.2 2.17-8.59L12 2.69z"/>
                            <path d="M12 22V2"/>
                        </svg>
                        {t.beautyTreatments}
                    </span>
                    <span className={`mobile-nav-item ${isActive('/appointments') ? 'active' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                            <line x1="12" y1="14" x2="12" y2="18"></line>
                            <line x1="16" y1="14" x2="16" y2="18"></line>
                        </svg>
                        {t.appointment}
                    </span>
                    <div className="mobile-nav-icons">
                        <span className="nav-icon" onClick={() => navigate('/settings')} style={{cursor: 'pointer'}}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>

            <div className="appointments-content">
                {/* --- FILTER PILLS --- */}
                <div className="filter-pills">
                    <button className={`pill ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>{t.allAppointment}</button>
                    <button className={`pill ${activeTab === 'confirmed' ? 'active' : ''}`} onClick={() => setActiveTab('confirmed')}>{t.confirmed}</button>
                    <button className={`pill ${activeTab === 'discount' ? 'active' : ''}`} onClick={() => setActiveTab('discount')}>{t.discount}</button>
                </div>

                {/* --- DISCOUNT TAB --- */}
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
                                        <div className="discount-tag">15%</div>
                                        <div className="service-image-wrapper">
                                            <img src={service.image} alt={service.name} className="service-image" />
                                        </div>
                                        <h3 className="service-title">{service.name}</h3>
                                        <div className="service-details">
                                            <span>{t.duration}: {service.duration} min</span>
                                            <span>{t.price}: {service.price} DA</span>
                                        </div>
                                        <button className="service-btn" onClick={() => navigate('/services')}>Book again</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* --- APPOINTMENT LIST --- */}
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
                                                <span>{t.price} : {app.price} DA</span>
                                                <span>{t.duration} : {app.service?.duration || "N/A"}</span>
                                                <span>Date : {formatDate(app.appointmentDate)}</span>
                                                <span>Time : {app.startTime} - {app.endTime}</span>
                                            </div>
                                        </div>
                                        <div className="card-actions">
                                            {app.status !== 'Completed' && app.status !== 'Cancelled' && (
                                                <button 
                                                    className="cancel-btn" 
                                                    onClick={() => handleCancelAppointment(app)}
                                                    disabled={cancellingId === app._id}
                                                >
                                                    {cancellingId === app._id ? 'Cancelling...' : t.cancel}
                                                </button>
                                            )}
                                            <div className="status-badge">
                                                {app.status === 'Pending' ? t.pending : app.status}
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