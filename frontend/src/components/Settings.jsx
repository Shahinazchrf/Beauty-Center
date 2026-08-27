import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const Settings = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t, changeLanguage } = useLanguage();
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [formData, setFormData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);

    // Load user from localStorage FIRST, then refresh from API
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

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
    }, []);

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

    // ✅ REAL-TIME UPDATE FUNCTION (Fully Optional Fields)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            // 1. PICTURE
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
            // 2. DELETE PICTURE
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
            // 3. PASSWORD
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
                    navigate('/login');
                } catch (err) { alert("❌ Failed to change password."); }
            }
            // 4. LANGUAGE - Use the context function
            else if (modalType === 'language') {
                await changeLanguage(formData.language);
                alert("✅ Language changed!");
                closeModal();
            }
            // 5. NAME, EMAIL/PHONE (ALL OPTIONAL)
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
        <div className="settings-page">
            <nav className="settings-navbar">
                <div className="nav-logo">BeautyBook</div>
                <div className="nav-links-desktop">
                    <span className={`nav-item ${isActive('/services') ? 'active' : ''}`} onClick={() => navigate('/services')}>
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
                    <span className={`nav-item ${isActive('/settings') ? 'active' : ''}`} onClick={() => navigate('/settings')}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                    </span>
                </div>
            </nav>

            <div className="settings-content">
                <div className="decorative-icons">
                    <span className="icon-1">💄</span>
                    <span className="icon-2">🌸</span>
                    <span className="icon-3">💅</span>
                    <span className="icon-4">🧴</span>
                    <span className="icon-5">💋</span>
                    <span className="icon-6">🪞</span>
                </div>

                <div className="settings-card">
                    <div className="profile-section">
                        <div className="profile-avatar">
                            {user && user.profileImage ? (
                                <img src={user.profileImage} alt="Profile" className="profile-image" />
                            ) : (
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="12" fill="#fce4b8" />
                                    <circle cx="12" cy="9.5" r="4" fill="#f8c3a1" />
                                    <path d="M4 20c0-3.87 3.58-7 8-7s8 3.13 8 7" fill="#c4a35a" />
                                </svg>
                            )}
                        </div>
                        <h2 className="profile-name">{user?.firstName || user?.lastName ? `${user.firstName || ''} ${user.lastName || ''}` : t.yourName}</h2>
                    </div>

                    <div className="settings-buttons">
                        <button className="setting-btn" onClick={() => openModal('picture')}>{t.changePicture}</button>
                        <button className="setting-btn" onClick={() => openModal('deletePicture')}>{t.deletePicture}</button>
                        <button className="setting-btn" onClick={() => openModal('name')}>{t.changeName}</button>
                        <button className="setting-btn" onClick={() => openModal('password')}>{t.changePassword}</button>
                        <button className="setting-btn" onClick={() => openModal('language')}>{t.changeLanguage}</button>
                        <button className="setting-btn" onClick={() => openModal('emailPhone')}>{t.changeEmail}</button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="settings-modal-overlay" onClick={closeModal}>
                    <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Update Settings</h3>
                        <form onSubmit={handleSubmit}>
                            {modalType === 'picture' && (
                                <>
                                    <label>Upload New Picture:</label>
                                    <input type="file" accept="image/*" onChange={handleFileChange} required />
                                </>
                            )}
                            {modalType === 'deletePicture' && <p style={{color: '#d32f2f'}}>Are you sure you want to delete your picture?</p>}
                            {modalType === 'name' && (
                                <>
                                    <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
                                    <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
                                </>
                            )}
                            {modalType === 'password' && (
                                <>
                                    <input type="password" name="newPassword" placeholder="New Password" onChange={handleChange} required />
                                    <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
                                </>
                            )}
                            {modalType === 'emailPhone' && (
                                <>
                                    <input type="email" name="email" placeholder="Email (optional)" onChange={handleChange} />
                                    <input type="text" name="phone" placeholder="Phone (optional)" onChange={handleChange} />
                                </>
                            )}
                            {modalType === 'language' && (
                                <select name="language" onChange={handleChange} defaultValue={user?.language || 'fr'} required>
                                    <option value="fr">French</option>
                                    <option value="en">English</option>
                                    <option value="ar">Arabic</option>
                                </select>
                            )}
                            <div className="modal-actions">
                                <button type="button" className="cancel-modal-btn" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="confirm-booking-btn">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;