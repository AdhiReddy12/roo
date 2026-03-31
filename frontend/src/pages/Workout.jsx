import React from 'react';
import './Workout.css';
import PageReveal from '../components/PageReveal';

export default function Workout() {
    return (
        <PageReveal className="workout-page" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minHeight: '60vh',
            textAlign: 'center'
        }}>
            <h1>️ Workout</h1>
            <p className="subtitle" style={{ fontSize: '1.2rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
            </p>
            <div className="glass-card" style={{ marginTop: '2rem', padding: '3rem', maxWidth: '500px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
                <h3>Feature work</h3>
            </div>
        </PageReveal>
    );
}
