import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Services = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/services', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setServices(res.data.data);
            } catch (err) {
                console.error("Failed to fetch services", err);
                setServices([]);
            } finally {
                setLoadingServices(false);
            }
        };
        fetchServices();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const isActive = (path) => location.pathname === path;

    const handleBookAppointment = async (service) => {
        setLoadingId(service._id);
        try {
            const token = localStorage.getItem('token');
            const today = new Date().toISOString().split('T')[0];
            const startTime = "10:00";
            const endTime = "11:00";

            await axios.post('http://localhost:5000/api/appointments', {
                serviceId: service._id,
                appointmentDate: today,
                startTime: startTime,
                endTime: endTime,
                notes: ""
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(`✅ ${service.name} booked successfully!`);
        } catch (error) {
            console.error("Booking Error:", error.response?.data || error.message);
            alert('❌ Failed to book appointment. Please try again.');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="services-page">
            <nav className="services-navbar">
                <div className="nav-logo">BeautyBook</div>
                <div className="hamburger" onClick={toggleMenu}>☰</div>
                
                <div className="nav-links desktop-nav">
                    {/* SVG Icon for Beauty treatments */}
                    <span className={`nav-item ${isActive('/services') ? 'active' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                            <path d="M12 2.69l5.19 5.2 7.48-1.65-2.17 8.59 7.41 4.2-5.19 5.2-7.48 1.65-4.2-7.41-7.41-4.2 2.17-8.59L12 2.69z"/>
                            <path d="M12 22V2"/>
                        </svg>
                        Beauty treatments
                    </span>
                    
                    {/* SVG Icon for Appointment */}
                    <span className={`nav-item ${isActive('/appointments') ? 'active' : ''}`} onClick={() => navigate('/appointments')}>
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

                    {/* Bell Icon SVG */}
                    <span className="nav-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                    </span>

                    {/* Settings Gear SVG */}
                    <span className="nav-icon" onClick={handleLogout} style={{cursor: 'pointer'}}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                    </span>
                </div>
            </nav>

            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    <span className={`mobile-nav-item ${isActive('/services') ? 'active' : ''}`}>🌸 Beauty treatments</span>
                    <span className={`mobile-nav-item ${isActive('/appointments') ? 'active' : ''}`} onClick={() => { setMenuOpen(false); navigate('/appointments'); }}>📅 Appointment</span>
                    <div className="mobile-nav-icons">
                        <span className="nav-icon">🔔</span>
                        <span className="nav-icon" onClick={handleLogout} style={{cursor: 'pointer'}}>⚙️</span>
                    </div>
                </div>
            </div>

            <div className="services-grid-container">
                <div className="services-grid">
                    {loadingServices ? (
                        <div className="loading">Loading services...</div>
                    ) : services.length === 0 ? (
                        <div className="empty-services">No services available.</div>
                    ) : (
                        services.map((service) => (
                            <div key={service._id} className="service-card">
                                <div className="service-image-wrapper">
                                    <img src={service.image} alt={service.name} className="service-image" />
                                </div>
                                <h3 className="service-title">{service.name}</h3>
                                <div className="service-details">
                                    <span>Durée: {service.duration} min</span>
                                    <span>Prix: {service.price} DA</span>
                                </div>
                                <button 
                                    className="service-btn" 
                                    onClick={() => handleBookAppointment(service)}
                                    disabled={loadingId === service._id}
                                >
                                    {loadingId === service._id ? 'Booking...' : 'Add to appointment'}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Services;