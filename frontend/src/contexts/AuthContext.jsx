import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@CoachingToken');
      const storedUser = await AsyncStorage.getItem('@CoachingUser');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, role) => {
    try {
      let response;
      if (role === 'student') {
        response = await api.post('/auth/login/student', { email_id: email, password });
      } else {
        response = await api.post('/auth/login/admin', { email, password });
      }

      const { token, user } = response.data;
      
      await AsyncStorage.setItem('@CoachingToken', token);
      await AsyncStorage.setItem('@CoachingUser', JSON.stringify(user));
      
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setToken(token);
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('@CoachingToken', token);
      await AsyncStorage.setItem('@CoachingUser', JSON.stringify(user));
      
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setToken(token);
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@CoachingToken');
    await AsyncStorage.removeItem('@CoachingUser');
    delete api.defaults.headers.Authorization;
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};