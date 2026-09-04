import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const Services = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    // Booking Modal States
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [bookingError, setBookingError] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('https://beauty-center-h667.onrender.com/api/services', {
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

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const isActive = (path) => location.pathname === path;

    // Open booking modal
    const openBookingModal = (service) => {
        setSelectedService(service);
        setSelectedDate('');
        setSelectedTime('');
        setAvailableSlots([]);
        setBookingError('');
        setShowBookingModal(true);
    };

    // Close booking modal
    const closeBookingModal = () => {
        setShowBookingModal(false);
        setSelectedService(null);
        setSelectedDate('');
        setSelectedTime('');
        setAvailableSlots([]);
        setBookingError('');
    };

    // Fetch available slots when date changes
    const handleDateChange = async (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        setSelectedTime('');
        setBookingError('');

        if (date && selectedService) {
            setLoadingSlots(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(
                    `https://beauty-center-h667.onrender.com/api/appointments/available?serviceId=${selectedService._id}&date=${date}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAvailableSlots(res.data.availableSlots || []);
            } catch (err) {
                console.error("Error fetching slots:", err);
                setAvailableSlots([]);
                setBookingError("Failed to load available slots. Please try again.");
            } finally {
                setLoadingSlots(false);
            }
        }
    };

    // Book appointment
    const handleBookAppointment = async () => {
        if (!selectedDate || !selectedTime) {
            setBookingError("Please select both date and time.");
            return;
        }

        setLoadingId(selectedService._id);
        setBookingError('');

        try {
            const token = localStorage.getItem('token');
            // Calculate end time (assuming 1 hour duration)
            const [hours, minutes] = selectedTime.split(':').map(Number);
            const endHours = hours + 1;
            const endTime = `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

            await axios.post('https://beauty-center-h667.onrender.com/api/appointments', {
                serviceId: selectedService._id,
                appointmentDate: selectedDate,
                startTime: selectedTime,
                endTime: endTime,
                notes: ""
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(`✅ ${selectedService.name} booked successfully for ${selectedDate} at ${selectedTime}!`);
            closeBookingModal();
        } catch (error) {
            console.error("Booking Error:", error.response?.data || error.message);
            setBookingError(error.response?.data?.message || '❌ Failed to book appointment. Please try again.');
        } finally {
            setLoadingId(null);
        }
    };

    // Get today's date for min date attribute
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="services-page">
            <nav className="services-navbar">
                <div className="nav-logo">BeautyBook</div>
                <div className="hamburger" onClick={toggleMenu}>☰</div>
                
                <div className="nav-links desktop-nav">
                    <span className={`nav-item ${isActive('/services') ? 'active' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                            <path d="M12 2.69l5.19 5.2 7.48-1.65-2.17 8.59 7.41 4.2-5.19 5.2-7.48 1.65-4.2-7.41-7.41-4.2 2.17-8.59L12 2.69z"/>
                            <path d="M12 22V2"/>
                        </svg>
                        {t.beautyTreatments}
                    </span>
                    
                    <span className={`nav-item ${isActive('/appointments') ? 'active' : ''}`} onClick={() => navigate('/appointments')}>
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
                    <span className={`mobile-nav-item ${isActive('/services') ? 'active' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                            <path d="M12 2.69l5.19 5.2 7.48-1.65-2.17 8.59 7.41 4.2-5.19 5.2-7.48 1.65-4.2-7.41-7.41-4.2 2.17-8.59L12 2.69z"/>
                            <path d="M12 22V2"/>
                        </svg>
                        {t.beautyTreatments}
                    </span>
                    <span className={`mobile-nav-item ${isActive('/appointments') ? 'active' : ''}`} onClick={() => { setMenuOpen(false); navigate('/appointments'); }}>
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
                                    <span>{t.duration}: {service.duration} min</span>
                                    <span>{t.price}: {service.price} DA</span>
                                </div>
                                <button 
                                    className="service-btn" 
                                    onClick={() => openBookingModal(service)}
                                    disabled={loadingId === service._id}
                                >
                                    {loadingId === service._id ? 'Booking...' : 'Add to appointment'}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* BOOKING MODAL */}
            {showBookingModal && selectedService && (
                <div className="booking-modal-overlay" onClick={closeBookingModal}>
                    <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Book {selectedService.name}</h3>
                        
                        <div className="modal-body">
                            {/* Date Picker */}
                            <div className="form-group">
                                <label>Select Date:</label>
                                <input
                                    type="date"
                                    className="date-input"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    min={today}
                                    required
                                />
                            </div>

                            {/* Time Slots */}
                            {selectedDate && (
                                <div className="form-group">
                                    <label>Select Time:</label>
                                    {loadingSlots ? (
                                        <p>Loading available slots...</p>
                                    ) : availableSlots.length === 0 ? (
                                        <p className="no-slots">No available slots for this date.</p>
                                    ) : (
                                        <div className="slots-container">
                                            {availableSlots.map((slot) => (
                                                <button
                                                    key={slot}
                                                    className={`slot-btn ${selectedTime === slot ? 'selected' : ''}`}
                                                    onClick={() => setSelectedTime(slot)}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Error Message */}
                            {bookingError && (
                                <div className="booking-error">{bookingError}</div>
                            )}

                            {/* Action Buttons */}
                            <div className="modal-actions">
                                <button 
                                    type="button" 
                                    className="cancel-modal-btn" 
                                    onClick={closeBookingModal}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="confirm-booking-btn"
                                    onClick={handleBookAppointment}
                                    disabled={!selectedDate || !selectedTime || loadingId === selectedService._id}
                                >
                                    {loadingId === selectedService._id ? 'Booking...' : 'Confirm Booking'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;