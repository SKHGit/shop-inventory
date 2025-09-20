import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, isAuthenticated: false, user: null });
  const navigate = useNavigate();

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      try {
        const res = await axios.get('/api/users/auth');
        setAuth({ token, isAuthenticated: true, user: res.data });
      } catch (err) {
        localStorage.removeItem('token');
        setAuth({ token: null, isAuthenticated: false, user: null });
      }
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      await loadUser();
      navigate('/inventory');
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      const res = await axios.post('/api/users/register', { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      await loadUser();
      navigate('/inventory');
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setAuth({ token: null, isAuthenticated: false, user: null });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ auth, login, signup, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
