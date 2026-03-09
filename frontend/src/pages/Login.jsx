import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/auth';
import './Auth.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await loginUser({ email, password });
            login(data.token, data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-header">
                <div className="auth-icon">🔥</div>
                <h1>Welcome Back</h1>
                <p>Log in to continue your fitness journey</p>
            </div>

            <form className="glass-card auth-form" onSubmit={handleSubmit}>
                {error && <div className="auth-error">{error}</div>}

                <div className="input-group">
                    <label htmlFor="login-email">Email</label>
                    <div className="input-field">
                        <span className="icon">✉</span>
                        <input
                            id="login-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="login-password">Password</label>
                    <div className="input-field">
                        <span className="icon">🔒</span>
                        <input
                            id="login-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button className="auth-submit" type="submit" disabled={loading}>
                    {loading ? 'Logging in…' : 'Log In'} <span>→</span>
                </button>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </form>
        </div>
    );
}
