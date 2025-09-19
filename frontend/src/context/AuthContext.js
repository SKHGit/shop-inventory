import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, isAuthenticated: false, user: null });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You might want to verify the token with the backend here
      setAuth({ token, isAuthenticated: true });
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/users/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setAuth({ token: res.data.token, isAuthenticated: true, user: res.data.user });
  };

  const signup = async (name, email, password) => {
    const res = await axios.post('/api/users/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    setAuth({ token: res.data.token, isAuthenticated: true, user: res.data.user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null, isAuthenticated: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
