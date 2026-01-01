import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get('/user');
                    setUser(data);
                } catch (e) {
                    console.error("Auth check failed", e);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/login', { email, password });
            localStorage.setItem('token', data.token);
            setUser(data.data);
            return { success: true, user: data.data };
        } catch (error) {
            console.error("Login Error", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await api.post('/register', userData);
            localStorage.setItem('token', data.token);
            setUser(data.data);
            return { success: true };
        } catch (error) {
            console.error("Register Error", error);
            return {
                success: false,
                errors: error.response?.data?.errors || { message: 'Registration failed' }
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
            localStorage.removeItem('token');
            setUser(null);
        } catch (error) {
            console.error("Logout Error", error);
            // Force logout client-side regardless
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
