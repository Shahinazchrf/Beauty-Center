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

const UserIcon = () => (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const CameraIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
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

// ---- MAIN COMPONENT ----
const AdminSettings = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t, changeLanguage } = useLanguage();
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [formData, setFormData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const dropdownRef = useRef(null);

    // Analytics data states
    const [appointments, setAppointments] = useState([]);
    const [clients, setClients] = useState([]);

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

        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data.user);
                localStorage.setItem('user', JSON.stringify(res.data.user));
            } catch (err) {
                console.error("Error fetching user", err);
            }
        };
        fetchUser();

        // Fetch appointments for analytics
        fetchAnalyticsData();
    }, [navigate]);

    const fetchAnalyticsData = async () => {
        try {
            const token = localStorage.getItem('token');
            const appointmentsRes = await axios.get('http://localhost:5000/api/appointments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const allAppointments = appointmentsRes.data.data || [];
            setAppointments(allAppointments);

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
            console.error("Error fetching analytics data:", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin-login');
    };

    const isActive = (path) => location.pathname === path;

    const openModal = (type) => {
        setModalType(type);
        setFormData({});
        setSelectedFile(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalType('');
        setFormData({});
        setSelectedFile(null);
    };

    const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const dropdownItems = [
        { 
            label: 'List of all appointments', 
            icon: <ListIcon />, 
            action: () => { navigate('/admin/dashboard'); setDropdownOpen(false); } 
        },
        { 
            label: 'Appointment Confirmed', 
            icon: <CheckCircleIcon />, 
            action: () => { navigate('/admin/dashboard'); setDropdownOpen(false); } 
        },
        { 
            label: 'List of all clients and contact', 
            icon: <UsersIcon />, 
            action: () => { navigate('/admin/dashboard'); setDropdownOpen(false); } 
        }
    ];

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            if (modalType === 'picture' && selectedFile) {
                const reader = new FileReader();
                reader.readAsDataURL(selectedFile);
                reader.onload = async () => {
                    try {
                        const res = await axios.put('http://localhost:5000/api/auth/update-profile-image', 
                            { profileImage: reader.result },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        setUser(res.data.user);
                        localStorage.setItem('user', JSON.stringify(res.data.user));
                        alert("✅ Picture updated!");
                        closeModal();
                    } catch (err) { alert("❌ Failed to upload picture."); }
                };
            } 
            else if (modalType === 'deletePicture') {
                try {
                    const res = await axios.put('http://localhost:5000/api/auth/update-profile-image', 
                        { profileImage: null },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setUser(res.data.user);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    alert("✅ Picture deleted!");
                    closeModal();
                } catch (err) { alert("❌ Failed to delete picture."); }
            }
            else if (modalType === 'password') {
                if (formData.newPassword !== formData.confirmPassword) { alert("❌ Passwords do not match!"); return; }
                if (formData.newPassword.length < 8) { alert("❌ Password must be at least 8 characters!"); return; }

                try {
                    await axios.put('http://localhost:5000/api/auth/update', 
                        { password: formData.newPassword },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    alert("✅ Password changed! Please login again.");
                    localStorage.removeItem('token'); localStorage.removeItem('user');
                    navigate('/admin-login');
                } catch (err) { alert("❌ Failed to change password."); }
            }
            else if (modalType === 'language') {
                await changeLanguage(formData.language);
                alert("✅ Language changed!");
                closeModal();
            }
            else {
                let updateData = {};
                if (modalType === 'name') {
                    updateData = { firstName: formData.firstName, lastName: formData.lastName };
                } else if (modalType === 'emailPhone') {
                    if (formData.email) updateData.email = formData.email;
                    if (formData.phone) updateData.phone = formData.phone;
                }

                try {
                    const res = await axios.put('http://localhost:5000/api/auth/update', updateData, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data.user);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    alert("✅ Changes saved!");
                    closeModal();
                } catch (err) { alert("❌ Failed to update."); }
            }
        } catch (err) { alert("❌ Failed to update."); }
    };

    return (
        <div className="admin-page">
            {/* ========== NAVBAR - SAME AS DASHBOARD ========== */}
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

                    {/* Settings - Active */}
                    <button className={`nav-icon-btn ${isActive('/admin/settings') ? 'active' : ''}`} onClick={() => navigate('/admin/settings')} title="Settings">
                        <SettingsIcon />
                    </button>

                    {/* Analytics - Opens Modal */}
                    <button className="nav-icon-btn" onClick={() => setShowAnalytics(!showAnalytics)} title="Analytics">
                        <ChartIcon />
                    </button>

                    {/* Logout */}
                    <button className="nav-logout-btn" onClick={handleLogout}>
                        <LogoutIcon />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            {/* ========== ANALYTICS MODAL ========== */}
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

            {/* ========== SETTINGS CONTENT ========== */}
            <div className="admin-settings-content">
                <h1 className="admin-welcome">Settings</h1>
                
                <div className="admin-settings-card">
                    {/* Profile Section */}
                    <div className="settings-profile-section">
                        <div className="settings-profile-avatar">
                            {user && user.profileImage ? (
                                <img src={user.profileImage} alt="Profile" className="profile-image" />
                            ) : (
                                <UserIcon />
                            )}
                            <button className="avatar-upload-btn" onClick={() => openModal('picture')}>
                                <CameraIcon />
                            </button>
                        </div>
                        <div className="settings-profile-info">
                            <h2>{user?.firstName || 'Admin'} {user?.lastName || ''}</h2>
                            <p className="settings-role">{user?.role === 'admin' ? '👑 Administrator' : '👤 Client'}</p>
                            <p className="settings-email">{user?.email || ''}</p>
                        </div>
                    </div>

                    {/* Settings Grid */}
                    <div className="settings-grid">
                        <button className="settings-grid-btn" onClick={() => openModal('picture')}>
                            <span className="settings-btn-icon">📸</span>
                            <span className="settings-btn-label">Change Profile Picture</span>
                        </button>
                        <button className="settings-grid-btn" onClick={() => openModal('deletePicture')}>
                            <span className="settings-btn-icon">🗑️</span>
                            <span className="settings-btn-label">Delete Profile Picture</span>
                        </button>
                        <button className="settings-grid-btn" onClick={() => openModal('name')}>
                            <span className="settings-btn-icon">✏️</span>
                            <span className="settings-btn-label">Change Name</span>
                        </button>
                        <button className="settings-grid-btn" onClick={() => openModal('password')}>
                            <span className="settings-btn-icon">🔑</span>
                            <span className="settings-btn-label">Change Password</span>
                        </button>
                        <button className="settings-grid-btn" onClick={() => openModal('language')}>
                            <span className="settings-btn-icon">🌍</span>
                            <span className="settings-btn-label">Change Language</span>
                        </button>
                        <button className="settings-grid-btn" onClick={() => openModal('emailPhone')}>
                            <span className="settings-btn-icon">📧</span>
                            <span className="settings-btn-label">Change Email / Phone</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="admin-modal-title">Update Settings</h3>
                        <form onSubmit={handleSubmit}>
                            {modalType === 'picture' && (
                                <>
                                    <label className="admin-modal-label">Upload New Picture:</label>
                                    <input type="file" accept="image/*" onChange={handleFileChange} required className="admin-modal-input" />
                                </>
                            )}
                            {modalType === 'deletePicture' && <p style={{color: '#dc2626'}}>Are you sure you want to delete your picture?</p>}
                            {modalType === 'name' && (
                                <>
                                    <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required className="admin-modal-input" />
                                    <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required className="admin-modal-input" />
                                </>
                            )}
                            {modalType === 'password' && (
                                <>
                                    <input type="password" name="newPassword" placeholder="New Password" onChange={handleChange} required className="admin-modal-input" />
                                    <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required className="admin-modal-input" />
                                </>
                            )}
                            {modalType === 'emailPhone' && (
                                <>
                                    <input type="email" name="email" placeholder="Email (optional)" onChange={handleChange} className="admin-modal-input" />
                                    <input type="text" name="phone" placeholder="Phone (optional)" onChange={handleChange} className="admin-modal-input" />
                                </>
                            )}
                            {modalType === 'language' && (
                                <select name="language" onChange={handleChange} defaultValue={user?.language || 'fr'} required className="admin-modal-select">
                                    <option value="fr">French</option>
                                    <option value="en">English</option>
                                    <option value="ar">Arabic</option>
                                </select>
                            )}
                            <div className="admin-modal-actions">
                                <button type="button" className="admin-modal-cancel" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="admin-modal-save">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;