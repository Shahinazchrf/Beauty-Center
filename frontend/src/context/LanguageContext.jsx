import React, { createContext, useState, useContext, useEffect } from 'react';
import translations from '../languages';
import axios from 'axios';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr');
  const [t, setT] = useState(translations.fr);

  // Load language from localStorage and user on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        // First check localStorage
        const savedLang = localStorage.getItem('language');
        if (savedLang && translations[savedLang]) {
          setLanguage(savedLang);
          setT(translations[savedLang]);
        }

        // Then check user from API
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get('https://beauty-center-h667.onrender.com/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const userLang = res.data.user?.language;
          if (userLang && translations[userLang]) {
            setLanguage(userLang);
            setT(translations[userLang]);
            localStorage.setItem('language', userLang);
          }
        }
      } catch (err) {
        console.error("Error loading language:", err);
      }
    };
    loadLanguage();
  }, []);

  // Update language function
  const changeLanguage = async (newLang) => {
    if (!translations[newLang]) return;
    
    setLanguage(newLang);
    setT(translations[newLang]);
    localStorage.setItem('language', newLang);

    // Update user's language preference on backend
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.put('https://beauty-center-h667.onrender.com/api/auth/update', 
          { language: newLang },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Update user in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.language = newLang;
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
    } catch (err) {
      console.error("Failed to update language on server:", err);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};