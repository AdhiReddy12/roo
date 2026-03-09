import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../api/auth';
import './Auth.css';

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        height: '', weight: '', goal: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    // Password validation
    const pw = form.password;
    const checks = {
        length: pw.length >= 8,
        uppercase: /[A-Z]/.test(pw),
        number: /[0-9]/.test(pw),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(pw),
        match: pw.length > 0 && pw === form.confirmPassword,
    };
    const allValid = Object.values(checks).every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!allValid) {
            setError('Please meet all password requirements');
            return;
        }
        setLoading(true);
        try {
            await signupUser({
                name: form.name,
                email: form.email,
                password: form.password,
                height: parseFloat(form.height),
                weight: parseFloat(form.weight),
                goal: form.goal,
            });
            navigate('/login');
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
                <h1>Start Your Journey</h1>
                <p>Create an account to get personalized fitness plans</p>
            </div>

            <form className="glass-card auth-form" onSubmit={handleSubmit}>
                {error && <div className="auth-error">{error}</div>}

                <div className="input-group">
                    <label htmlFor="signup-name">Full Name</label>
                    <div className="input-field">
                        <span className="icon">👤</span>
                        <input id="signup-name" type="text" placeholder="John Doe"
                            value={form.name} onChange={update('name')} required />
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="signup-email">Email</label>
                    <div className="input-field">
                        <span className="icon">✉</span>
                        <input id="signup-email" type="email" placeholder="you@example.com"
                            value={form.email} onChange={update('email')} required />
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="signup-password">Password</label>
                    <div className="input-field">
                        <span className="icon">🔒</span>
                        <input id="signup-password" type="password" placeholder="••••••••"
                            value={form.password} onChange={update('password')} required />
                    </div>
                    {pw.length > 0 && (
                        <ul className="password-requirements">
                            <li className={checks.length ? 'valid' : ''}>
                                <span className="check">{checks.length ? '✓' : '○'}</span> At least 8 characters
                            </li>
                            <li className={checks.uppercase ? 'valid' : ''}>
                                <span className="check">{checks.uppercase ? '✓' : '○'}</span> One uppercase letter
                            </li>
                            <li className={checks.number ? 'valid' : ''}>
                                <span className="check">{checks.number ? '✓' : '○'}</span> One number
                            </li>
                            <li className={checks.special ? 'valid' : ''}>
                                <span className="check">{checks.special ? '✓' : '○'}</span> One special character
                            </li>
                        </ul>
                    )}
                </div>

                <div className="input-group">
                    <label htmlFor="signup-confirm">Confirm Password</label>
                    <div className="input-field">
                        <span className="icon">🔒</span>
                        <input id="signup-confirm" type="password" placeholder="••••••••"
                            value={form.confirmPassword} onChange={update('confirmPassword')} required />
                    </div>
                    {form.confirmPassword.length > 0 && !checks.match && (
                        <span style={{ color: '#ef4444', fontSize: 'var(--font-xs)' }}>Passwords do not match</span>
                    )}
                </div>

                <div className="auth-row">
                    <div className="input-group">
                        <label htmlFor="signup-height">Height (cm)</label>
                        <div className="input-field">
                            <span className="icon">📏</span>
                            <input id="signup-height" type="number" placeholder="175"
                                value={form.height} onChange={update('height')} required />
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="signup-weight">Weight (kg)</label>
                        <div className="input-field">
                            <span className="icon">⚖</span>
                            <input id="signup-weight" type="number" placeholder="70"
                                value={form.weight} onChange={update('weight')} required />
                        </div>
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="signup-goal">Fitness Goal</label>
                    <div className="input-field">
                        <span className="icon">🎯</span>
                        <select id="signup-goal" value={form.goal} onChange={update('goal')} required>
                            <option value="" disabled>Select your goal</option>
                            <option value="lose_weight">Lose Weight</option>
                            <option value="build_muscle">Build Muscle</option>
                            <option value="stay_fit">Stay Fit</option>
                            <option value="gain_weight">Gain Weight</option>
                        </select>
                    </div>
                </div>

                <button className="auth-submit" type="submit" disabled={loading || !allValid}>
                    {loading ? 'Creating…' : 'Create Account'} <span>→</span>
                </button>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </form>
        </div>
    );
}
