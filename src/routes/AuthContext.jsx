import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          handleLogout();
        } else {
          setRole(decoded.role);
        }
      } catch (error) {
        console.error('Lỗi giải mã token:', error);
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setRole(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ role, setRole, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};