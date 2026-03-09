import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { logWorkout, generateWorkoutPlan } from '../api/auth';
import './Workout.css';

const TABS = ['Live Posture', 'Suggested Plan', 'Log Workout'];

export default function Workout() {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState('Suggested Plan');

    // Suggested Plan state
    const [plan, setPlan] = useState(null);
    const [planLoading, setPlanLoading] = useState(false);
    const [planError, setPlanError] = useState('');

    // Log Workout state
    const [logForm, setLogForm] = useState({ workout_name: '', duration: '', calories_burned: '', date: '' });
    const [logLoading, setLogLoading] = useState(false);
    const [logMsg, setLogMsg] = useState('');
    const [logError, setLogError] = useState('');

    // Posture state
    const [cameraActive, setCameraActive] = useState(false);

    // -- Suggested Plan handlers --
    const handleCreatePlan = async () => {
        setPlanLoading(true);
        setPlanError('');
        try {
            const data = await generateWorkoutPlan(token);
            setPlan(data);
        } catch (err) {
            setPlanError(err.message);
        } finally {
            setPlanLoading(false);
        }
    };

    // -- Log Workout handlers --
    const updateLog = (field) => (e) => setLogForm({ ...logForm, [field]: e.target.value });

    const handleLogWorkout = async (e) => {
        e.preventDefault();
        setLogLoading(true);
        setLogMsg('');
        setLogError('');
        try {
            await logWorkout(token, {
                workout_name: logForm.workout_name,
                duration: parseInt(logForm.duration),
                calories_burned: parseInt(logForm.calories_burned),
                date: logForm.date || new Date().toISOString().split('T')[0],
            });
            setLogMsg('Workout logged successfully! 🎉');
            setLogForm({ workout_name: '', duration: '', calories_burned: '', date: '' });
        } catch (err) {
            setLogError(err.message);
        } finally {
            setLogLoading(false);
        }
    };

    // -- Posture handler --
    const handleStartCamera = async () => {
        setCameraActive(true);
        // MediaPipe integration will run in the video element via useEffect in Phase 4
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.getElementById('posture-video');
            if (video) {
                video.srcObject = stream;
                video.play();
            }
        } catch (err) {
            setCameraActive(false);
            alert('Camera access denied. Please allow camera permissions.');
        }
    };

    const handleStopCamera = () => {
        const video = document.getElementById('posture-video');
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(t => t.stop());
            video.srcObject = null;
        }
        setCameraActive(false);
    };

    return (
        <div className="workout-page">
            <h1>Workout</h1>
            <p className="subtitle">Track exercises and check your form in real-time</p>

            <div className="workout-tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        className={`workout-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="workout-panel">
                {/* ========== SUGGESTED PLAN ========== */}
                {activeTab === 'Suggested Plan' && (
                    <div className="glass-card suggested-plan-card">
                        <div className="suggested-plan-header">
                            <h3>💪 Create Suggested Plan</h3>
                            <button className="create-plan-btn" onClick={handleCreatePlan} disabled={planLoading}>
                                {planLoading ? '⏳ Generating…' : '✨ Create Plan'}
                            </button>
                        </div>

                        {planError && <div className="plan-error">{planError}</div>}

                        {!plan && !planLoading && (
                            <div className="empty-plan">
                                <div className="empty-icon">💪</div>
                                <p>Click <span className="accent">"Create Plan"</span> to get a personalized workout based on your goals</p>
                            </div>
                        )}

                        {plan && (
                            <div className="plan-result">
                                <div className="plan-summary">
                                    <div className="plan-stat">
                                        <span className="plan-stat-value">{plan.exercises.length}</span>
                                        <span className="plan-stat-label">Exercises</span>
                                    </div>
                                    <div className="plan-stat">
                                        <span className="plan-stat-value">{plan.total_duration} min</span>
                                        <span className="plan-stat-label">Total Duration</span>
                                    </div>
                                    <div className="plan-stat">
                                        <span className="plan-stat-value">{plan.total_calories}</span>
                                        <span className="plan-stat-label">Est. Calories</span>
                                    </div>
                                </div>
                                <div className="plan-exercises">
                                    {plan.exercises.map((ex, i) => (
                                        <div key={i} className="exercise-row">
                                            <div className="exercise-num">{i + 1}</div>
                                            <div className="exercise-info">
                                                <div className="exercise-name">{ex.name}</div>
                                                <div className="exercise-meta">
                                                    <span className="exercise-badge">{ex.type}</span>
                                                    <span>{ex.duration} min</span>
                                                    <span>~{ex.calories} cal</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ========== LIVE POSTURE ========== */}
                {activeTab === 'Live Posture' && (
                    <div className="glass-card posture-card">
                        {!cameraActive ? (
                            <>
                                <div className="cam-placeholder">
                                    <span className="cam-icon">📷</span>
                                    <p>Camera feed will appear here</p>
                                    <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                                        Uses MediaPipe for real-time pose detection
                                    </p>
                                </div>
                                <button className="btn-primary" onClick={handleStartCamera}>
                                    Start Posture Check
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="posture-video-wrapper">
                                    <video id="posture-video" className="posture-video" autoPlay playsInline muted />
                                    <div className="posture-overlay">
                                        <span className="posture-status live">🔴 LIVE</span>
                                    </div>
                                </div>
                                <button className="btn-secondary" onClick={handleStopCamera} style={{ marginTop: 'var(--space-md)' }}>
                                    Stop Camera
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* ========== LOG WORKOUT ========== */}
                {activeTab === 'Log Workout' && (
                    <div className="glass-card log-workout-card">
                        <h3>Log a Workout</h3>

                        {logMsg && <div className="log-success">{logMsg}</div>}
                        {logError && <div className="log-error">{logError}</div>}

                        <form className="log-form" onSubmit={handleLogWorkout}>
                            <div className="input-group">
                                <label>Workout Name</label>
                                <div className="input-field">
                                    <span className="icon">🏋️</span>
                                    <input type="text" placeholder="e.g. Morning Run" value={logForm.workout_name}
                                        onChange={updateLog('workout_name')} required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Duration (minutes)</label>
                                <div className="input-field">
                                    <span className="icon">⏱</span>
                                    <input type="number" placeholder="30" value={logForm.duration}
                                        onChange={updateLog('duration')} required min="1" />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Calories Burned</label>
                                <div className="input-field">
                                    <span className="icon">🔥</span>
                                    <input type="number" placeholder="250" value={logForm.calories_burned}
                                        onChange={updateLog('calories_burned')} required min="1" />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Date</label>
                                <div className="input-field">
                                    <span className="icon">📅</span>
                                    <input type="date" value={logForm.date} onChange={updateLog('date')} />
                                </div>
                            </div>
                            <div className="full-width">
                                <button className="btn-primary" type="submit" disabled={logLoading}>
                                    {logLoading ? 'Logging…' : 'Log Workout'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
