import React from 'react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
    const navigate = useNavigate();

    // Hardcoded data matching your mockup. 
    // In the future, this will come from your MongoDB database!
    const services = [
        { id: 1, title: "Soin visage", duration: "1h", price: "3000 DA", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop" },
        { id: 2, title: "Massage relaxant", duration: "1h30min", price: "4000 DA", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop" },
        { id: 3, title: "Coiffure femme", duration: "2h", price: "3000 DA", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2070&auto=format&fit=crop" },
        { id: 4, title: "Coloration cheveux", duration: "3h", price: "6000 DA", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=2070&auto=format&fit=crop" },
        { id: 5, title: "Pédicure", duration: "1h", price: "2000 DA", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059eaa2?q=80&w=2070&auto=format&fit=crop" },
        { id: 6, title: "Épilation", duration: "1h", price: "3000 DA", image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2070&auto=format&fit=crop" },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="services-page">
            {/* ---------------- NAVBAR ---------------- */}
            <nav className="services-navbar">
                <div className="nav-logo">BeautyBook</div>
                
                <div className="nav-links">
                    <span className="nav-item active">🌸 Beauty treatments</span>
                    <span className="nav-item">📅 Appointment</span>
                    <span className="nav-icon">🔔</span>
                    <span className="nav-icon" onClick={handleLogout} style={{cursor: 'pointer'}}>⚙️</span>
                </div>
            </nav>

            {/* ---------------- GRID OF SERVICES ---------------- */}
            <div className="services-grid-container">
                <div className="services-grid">
                    {services.map((service) => (
                        <div key={service.id} className="service-card">
                            <div className="service-image-wrapper">
                                <img src={service.image} alt={service.title} className="service-image" />
                            </div>
                            <h3 className="service-title">{service.title}</h3>
                            <div className="service-details">
                                <span>Durée: {service.duration}</span>
                                <span>Prix: {service.price}</span>
                            </div>
                            // Inside your Services.jsx, update the button inside the map:
<button 
    className="service-btn" 
    onClick={() => {
        // This is where you will later send a request to your backend
        console.log(`Added service: ${service.title}`);
        alert(`You selected: ${service.title} for ${service.price}`);
    }}
>
    Add to appointment
</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;