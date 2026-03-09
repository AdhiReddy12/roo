import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <NavLink to="/dashboard" className="navbar-brand">
                <span className="brand-icon">🔥</span>
                Iron Pulse
            </NavLink>

            <div className="navbar-links">
                <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">📊</span>
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/workout" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">💪</span>
                    <span>Workout</span>
                </NavLink>
                <NavLink to="/food-plan" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">🍽️</span>
                    <span>Food Plan</span>
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">👤</span>
                    <span>Profile</span>
                </NavLink>
            </div>

            <button className="nav-logout" onClick={handleLogout}>
                <span>↪</span>
                <span>Logout</span>
            </button>
        </nav>
    );
}
