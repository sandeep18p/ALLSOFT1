import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedMobile = localStorage.getItem('mobileNumber');
    const savedUserId = localStorage.getItem('userId');
    const savedUserName = localStorage.getItem('userName');
    const savedRoles = localStorage.getItem('roles');
    if (savedToken && savedMobile) {
      setToken(savedToken);
      setMobileNumber(savedMobile);
      setUserId(savedUserId || '');
      setUserName(savedUserName || '');
      setRoles(savedRoles ? JSON.parse(savedRoles) : []);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (authToken, mobile, userId = '', userName = '', roles = []) => {
    setToken(authToken);
    setMobileNumber(mobile);
    setUserId(userId);
    setUserName(userName);
    setRoles(roles);
    setIsAuthenticated(true);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('mobileNumber', mobile);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    localStorage.setItem('roles', JSON.stringify(roles));
  };

  const logout = () => {
    setToken(null);
    setMobileNumber('');
    setUserId('');
    setUserName('');
    setRoles([]);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('mobileNumber');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('roles');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, mobileNumber, userId, userName, roles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

