import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

// ---- SVG ICONS ----
const ListIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        <path d="M20 4v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const UsersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const ChartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <path d="M6 10l3-3 2 2 3-3 4 4" />
    </svg>
);

const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const InfoIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
    </svg>
);

// ---- MAIN COMPONENT ----
const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('appointments');
    
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const [showAnalytics, setShowAnalytics] = useState(false);
    
    // State for expanded client info
    const [expandedClientId, setExpandedClientId] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.role !== 'admin') {
                navigate('/services');
                return;
            }
            setUser(userData);
        }
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const appointmentsRes = await axios.get('http://localhost:5000/api/appointments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const allAppointments = appointmentsRes.data.data || [];
            setAppointments(allAppointments);

            // Extract unique clients from appointments
            const clientMap = new Map();
            allAppointments.forEach(app => {
                if (app.client && app.client._id) {
                    const clientId = app.client._id;
                    if (!clientMap.has(clientId)) {
                        clientMap.set(clientId, {
                            ...app.client,
                            appointmentCount: 1,
                            appointments: [app]
                        });
                    } else {
                        const existing = clientMap.get(clientId);
                        existing.appointmentCount += 1;
                        existing.appointments.push(app);
                    }
                }
            });
            setClients(Array.from(clientMap.values()));

        } catch (err) {
            console.error("Error fetching admin data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmAppointment = async (appointmentId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/appointments/confirm/${appointmentId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('✅ Appointment confirmed! Notification sent to client.');
            fetchData();
        } catch (error) {
            console.error('Error confirming appointment:', error);
            alert('❌ Failed to confirm appointment. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin-login');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const dropdownItems = [
        { 
            label: 'List of all appointments', 
            icon: <ListIcon />, 
            action: () => setActiveTab('appointments') 
        },
        { 
            label: 'Appointment Confirmed', 
            icon: <CheckCircleIcon />, 
            action: () => { setActiveTab('confirmed'); } 
        },
        { 
            label: 'List of all clients and contact', 
            icon: <UsersIcon />, 
            action: () => setActiveTab('clients') 
        }
    ];

    const confirmedAppointments = appointments.filter(app => app.status === 'Confirmed');

    const getAnalytics = () => {
        const today = new Date().toISOString().split('T')[0];
        const totalClients = clients.length;
        const todaysAppointments = appointments.filter(app => {
            const appDate = new Date(app.appointmentDate).toISOString().split('T')[0];
            return appDate === today;
        }).length;
        const upcomingAppointments = appointments.filter(app => {
            const appDate = new Date(app.appointmentDate);
            return appDate >= new Date() && app.status !== 'Cancelled' && app.status !== 'Completed';
        }).length;
        const pendingRequests = appointments.filter(app => app.status === 'Pending').length;
        const confirmedCount = appointments.filter(app => app.status === 'Confirmed').length;
        const completedCount = appointments.filter(app => app.status === 'Completed').length;
        const cancelledCount = appointments.filter(app => app.status === 'Cancelled').length;
        const totalRevenue = appointments
            .filter(app => app.status !== 'Cancelled')
            .reduce((sum, app) => sum + (app.price || 0), 0);

        return {
            totalClients,
            todaysAppointments,
            upcomingAppointments,
            pendingRequests,
            confirmedCount,
            completedCount,
            cancelledCount,
            totalRevenue
        };
    };

    // Toggle client details
    const toggleClientDetails = (clientId) => {
        setExpandedClientId(expandedClientId === clientId ? null : clientId);
    };

    return (
        <div className="admin-page">
            {/* NAVBAR */}
            <nav className="admin-navbar-new">
                <div className="nav-logo">BeautyBook Admin</div>
                
                <div className="nav-links-container">
                    <div className="dropdown-container" ref={dropdownRef}>
                        <button 
                            className={`nav-dropdown-btn ${dropdownOpen ? 'active' : ''}`}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <ListIcon />
                            <span>List</span>
                            <ChevronDownIcon />
                        </button>
                        
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                {dropdownItems.map((item, index) => (
                                    <div 
                                        key={index} 
                                        className="dropdown-item"
                                        onClick={() => {
                                            item.action();
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        <span className="dropdown-item-icon">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="nav-icon-btn" onClick={() => navigate('/admin/settings')} title="Settings">
                        <SettingsIcon />
                    </button>

                    <button className="nav-icon-btn" onClick={() => setShowAnalytics(!showAnalytics)} title="Analytics">
                        <ChartIcon />
                    </button>

                    <button className="nav-logout-btn" onClick={handleLogout}>
                        <LogoutIcon />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            {/* ANALYTICS MODAL */}
            {showAnalytics && (
                <div className="analytics-modal-overlay" onClick={() => setShowAnalytics(false)}>
                    <div className="analytics-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="analytics-header">
                            <h2>📊 Dashboard Analytics</h2>
                            <button className="close-analytics-btn" onClick={() => setShowAnalytics(false)}>✕</button>
                        </div>
                        
                        <div className="analytics-grid">
                            <div className="analytics-card total-clients">
                                <div className="analytics-icon"><UsersIcon /></div>
                                <div className="analytics-info">
                                    <h3>{getAnalytics().totalClients}</h3>
                                    <p>Total Clients</p>
                                </div>
                            </div>
                            <div className="analytics-card today-appointments">
                                <div className="analytics-icon"><ListIcon /></div>
                                <div className="analytics-info">
                                    <h3>{getAnalytics().todaysAppointments}</h3>
                                    <p>Today's Appointments</p>
                                </div>
                            </div>
                            <div className="analytics-card upcoming">
                                <div className="analytics-icon"><ChartIcon /></div>
                                <div className="analytics-info">
                                    <h3>{getAnalytics().upcomingAppointments}</h3>
                                    <p>Upcoming Appointments</p>
                                </div>
                            </div>
                            <div className="analytics-card pending">
                                <div className="analytics-icon"><ChartIcon /></div>
                                <div className="analytics-info">
                                    <h3>{getAnalytics().pendingRequests}</h3>
                                    <p>Pending Requests</p>
                                </div>
                            </div>
                            <div className="analytics-card confirmed">
                                <div className="analytics-icon"><CheckCircleIcon /></div>
                                <div className="analytics-info">
                                    <h3>{getAnalytics().confirmedCount}</h3>
                                    <p>Confirmed Appointments</p>
                                </div>
                            </div>
                            <div className="analytics-card completed">
                                <div className="analytics-icon"><CheckCircleIcon /></div>
                                <div className="analytics-info">
                                    <h3>{getAnalytics().completedCount}</h3>
                                    <p>Completed Appointments</p>
                                </div>
                            </div>
                            <div className="analytics-card cancelled">
                                <div className="analytics-icon"><LogoutIcon /></div>
                                <div className="analytics-info">
                                    <h3>{getAnalytics().cancelledCount}</h3>
                                    <p>Cancelled Appointments</p>
                                </div>
                            </div>
                            <div className="analytics-card revenue">
                                <div className="analytics-icon"><ChartIcon /></div>
                                <div className="analytics-info">
                                    <h3>{getAnalytics().totalRevenue} DA</h3>
                                    <p>Total Revenue</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="admin-content">
                <h1 className="admin-welcome">Welcome back, {user?.firstName || 'Admin'}! 👋</h1>
                
                {/* TABS */}
                <div className="admin-tabs">
                    {activeTab === 'appointments' && (
                        <button className="admin-tab active" onClick={() => setActiveTab('appointments')}>
                            <ListIcon /> List of all appointments
                        </button>
                    )}
                    {activeTab === 'confirmed' && (
                        <button className="admin-tab active" onClick={() => setActiveTab('confirmed')}>
                            <CheckCircleIcon /> Appointment Confirmed
                        </button>
                    )}
                    {activeTab === 'clients' && (
                        <button className="admin-tab active" onClick={() => setActiveTab('clients')}>
                            <UsersIcon /> List of all clients
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="loading-spinner">Loading...</div>
                ) : (
                    <div className="admin-content-body">
                        {/* APPOINTMENTS TAB */}
                        {activeTab === 'appointments' && (
                            <div className="appointments-list-container">
                                {appointments.length === 0 ? (
                                    <div className="empty-state">
                                        <p>No appointments yet.</p>
                                    </div>
                                ) : (
                                    appointments.map((app) => (
                                        <div key={app._id} className="admin-appointment-row">
                                            <div className="appointment-row-content">
                                                <div className="appointment-row-image">
                                                    {app.service?.image ? (
                                                        <img src={app.service.image} alt={app.service.name} />
                                                    ) : (
                                                        <div className="no-image">No Image</div>
                                                    )}
                                                </div>
                                                
                                                <div className="appointment-row-details">
                                                    <h3 className="appointment-row-title">{app.service?.name || 'Unknown Service'}</h3>
                                                    <div className="appointment-row-info">
                                                        <span className="info-item">💲 Prix: <strong>{app.price} DA</strong></span>
                                                        <span className="info-item">⏱️ Duration: <strong>{app.service?.duration || 'N/A'} min</strong></span>
                                                        <span className="info-item">📅 Date: <strong>{formatDate(app.appointmentDate)}</strong></span>
                                                        <span className="info-item">🕐 Time: <strong>{app.startTime} - {app.endTime}</strong></span>
                                                    </div>
                                                </div>
                                                
                                                <div className="appointment-row-actions">
                                                    <div className="client-info-pill">
                                                        <span className="client-name">
                                                            {app.client?.firstName || app.client?.username || app.client?.email || 'Unknown Client'}
                                                        </span>
                                                    </div>
                                                    
                                                    {app.status === 'Pending' ? (
                                                        <button 
                                                            className="confirm-btn-small"
                                                            onClick={() => handleConfirmAppointment(app._id)}
                                                        >
                                                            <CheckCircleIcon /> Confirm
                                                        </button>
                                                    ) : (
                                                        <span className={`status-badge ${app.status.toLowerCase()}`}>
                                                            {app.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* CONFIRMED TAB */}
                        {activeTab === 'confirmed' && (
                            <div className="appointments-list-container">
                                {confirmedAppointments.length === 0 ? (
                                    <div className="empty-state">
                                        <p>No confirmed appointments yet.</p>
                                    </div>
                                ) : (
                                    confirmedAppointments.map((app) => (
                                        <div key={app._id} className="admin-appointment-row">
                                            <div className="appointment-row-content">
                                                <div className="appointment-row-image">
                                                    {app.service?.image ? (
                                                        <img src={app.service.image} alt={app.service.name} />
                                                    ) : (
                                                        <div className="no-image">No Image</div>
                                                    )}
                                                </div>
                                                <div className="appointment-row-details">
                                                    <h3 className="appointment-row-title">{app.service?.name || 'Unknown Service'}</h3>
                                                    <div className="appointment-row-info">
                                                        <span className="info-item">💲 Prix: <strong>{app.price} DA</strong></span>
                                                        <span className="info-item">⏱️ Duration: <strong>{app.service?.duration || 'N/A'} min</strong></span>
                                                        <span className="info-item">📅 Date: <strong>{formatDate(app.appointmentDate)}</strong></span>
                                                        <span className="info-item">🕐 Time: <strong>{app.startTime} - {app.endTime}</strong></span>
                                                    </div>
                                                </div>
                                                <div className="appointment-row-actions">
                                                    <div className="client-info-pill">
                                                        <span className="client-name">
                                                            {app.client?.firstName || app.client?.username || app.client?.email || 'Unknown Client'}
                                                        </span>
                                                    </div>
                                                    <span className="status-badge confirmed">✅ Confirmed</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* CLIENTS TAB - NEW DESIGN */}
                        {activeTab === 'clients' && (
                            <div className="clients-list-container">
                                {clients.length === 0 ? (
                                    <div className="empty-state">
                                        <p>No clients yet.</p>
                                    </div>
                                ) : (
                                    clients.map((client) => (
                                        <div key={client._id} className="admin-client-card-new">
                                            {/* Client Header */}
                                            <div className="client-card-header">
                                                <div className="client-avatar">
                                                    {client.profileImage ? (
                                                        <img src={client.profileImage} alt={client.firstName} />
                                                    ) : (
                                                        <img 
                                                            src={`https://ui-avatars.com/api/?name=${client.firstName || 'C'}+${client.lastName || 'L'}&background=cbb26c&color=white&size=128&bold=true`} 
                                                            alt="Default Avatar" 
                                                            className="default-avatar-img"
                                                        />
                                                    )}
                                                </div>
                                                
                                                <div className="client-info">
                                                    <p className="client-name-label">Client Name: <strong>{client.firstName || 'Unknown'} {client.lastName || ''}</strong></p>
                                                    <p className="client-phone-label">Phone: <strong>{client.phone || 'N/A'}</strong></p>
                                                    <p className="client-email-label">Email: <strong>{client.email || 'N/A'}</strong></p>
                                                </div>
                                                
                                                <div className="client-appointment-count">
                                                    <p>Appointments: <strong>{client.appointmentCount}</strong></p>
                                                    <button 
                                                        className="more-info-btn"
                                                        onClick={() => toggleClientDetails(client._id)}
                                                    >
                                                        <InfoIcon /> more information about appointment
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Expanded Appointment Details */}
                                            {expandedClientId === client._id && (
                                                <div className="client-appointments-details">
                                                    <h4>Appointments Details:</h4>
                                                    {client.appointments && client.appointments.length > 0 ? (
                                                        client.appointments.map((app, index) => (
                                                            <div key={index} className="client-appointment-detail-row">
                                                                <div className="detail-row">
                                                                    <span className="label">Service:</span>
                                                                    <span className="value">{app.service?.name || 'Unknown'}</span>
                                                                </div>
                                                                <div className="detail-row">
                                                                    <span className="label">Date:</span>
                                                                    <span className="value">{formatDate(app.appointmentDate)}</span>
                                                                </div>
                                                                <div className="detail-row">
                                                                    <span className="label">Time:</span>
                                                                    <span className="value">{app.startTime} - {app.endTime}</span>
                                                                </div>
                                                                <div className="detail-row">
                                                                    <span className="label">Duration:</span>
                                                                    <span className="value">{app.service?.duration || 'N/A'} min</span>
                                                                </div>
                                                                <div className="detail-row">
                                                                    <span className="label">Price:</span>
                                                                    <span className="value">{app.price} DA</span>
                                                                </div>
                                                                <div className="detail-row">
                                                                    <span className="label">Status:</span>
                                                                    <span className={`status-badge ${app.status.toLowerCase()}`}>
                                                                        {app.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="no-appointments-text">No appointments for this client.</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;