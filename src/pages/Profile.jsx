import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchWorkouts } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import PageReveal from '../components/PageReveal';
import './Profile.css';

const GOAL_LABELS = {
    lose_weight: 'Lose Weight',
    build_muscle: 'Build Muscle',
    stay_fit: 'Stay Fit',
    gain_weight: 'Gain Weight',
};

export default function Profile() {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState([]);
    const [loadingWorkouts, setLoadingWorkouts] = useState(true);

    const name = user?.name || 'User';
    const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

    useEffect(() => {
        if (token) {
            fetchWorkouts(token)
                .then(setWorkouts)
                .catch(() => { })
                .finally(() => setLoadingWorkouts(false));
        } else {
            setLoadingWorkouts(false);
        }
    }, [token]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
            <PageReveal className="profile-page">
                <h1>Profile</h1>
                <p className="subtitle">Your fitness profile and progress</p>

                <div className="glass-card profile-card">
                    <div className="profile-avatar">
                        <div className="avatar-circle">{initials}</div>
                        <div className="avatar-info">
                            <h2>{name}</h2>
                            <p>{user?.email || 'No email'}</p>
                        </div>
                    </div>

                    <div className="profile-details">
                        <div className="profile-field">
                            <label>Height</label>
                            <div className="value">{user?.height || '—'} cm</div>
                        </div>
                        <div className="profile-field">
                            <label>Weight</label>
                            <div className="value">{user?.weight || '—'} kg</div>
                        </div>
                        <div className="profile-field">
                            <label>Fitness Goal</label>
                            <div className="value">{GOAL_LABELS[user?.goal] || user?.goal || '—'}</div>
                        </div>
                        <div className="profile-field">
                            <label>Member Since</label>
                            <div className="value">
                                {user?.created_at
                                    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                                    : '—'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Workout History */}
                <div className="glass-card history-card">
                    <h3>Recent Workouts</h3>
                    {loadingWorkouts ? (
                        <div className="history-empty">
                            <div className="spinner small" />
                        </div>
                    ) : workouts.length === 0 ? (
                        <div className="history-empty">
                            <p>No workouts logged yet. Head to the Workout page to get started!</p>
                        </div>
                    ) : (
                        <div className="history-list">
                            {workouts.slice(0, 10).map((w) => (
                                <div key={w.id} className="history-item">
                                    <div className="history-left">
                                        <div className="history-icon">💪</div>
                                        <div>
                                            <div className="history-name">{w.workout_name}</div>
                                            <div className="history-date">{w.date}</div>
                                        </div>
                                    </div>
                                    <div className="history-right">
                                        <span className="history-stat">{w.duration} min</span>
                                        <span className="history-stat accent">{w.calories_burned} cal</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Logout Button */}
                <button className="profile-logout-btn" onClick={handleLogout}>
                    <span>↪</span> Logout
                </button>
            </PageReveal>
    );
}
