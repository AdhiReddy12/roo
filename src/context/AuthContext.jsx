import { createContext, useContext, useState, useEffect } from 'react';
import { fetchProfile } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('iron_pulse_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // fetchProfile now returns raw demo data (fetch is commented out inside)
            fetchProfile(token)
                .then((data) => {
                    setUser(data);
                    setLoading(false);
                })
                .catch(() => {
                    localStorage.removeItem('iron_pulse_token');
                    setToken(null);
                    setUser(null);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = (jwt, userData) => {
        localStorage.setItem('iron_pulse_token', jwt);
        setToken(jwt);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('iron_pulse_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
