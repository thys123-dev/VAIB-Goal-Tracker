'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [redirecting, setRedirecting] = useState(false);

    // Auto redirect if user is already logged in
    useEffect(() => {
        const checkAuth = async () => {
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
                window.location.href = '/dashboard';
            }
        };
        checkAuth();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Check if user exists in the database
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('email, verified')
                .eq('email', email)
                .single();

            if (userError) {
                setMessage('User not found. Please contact support to get access.');
                setLoading(false);
                return;
            }

            if (!userData.verified) {
                setMessage('Your email is not verified. Please contact support.');
                setLoading(false);
                return;
            }

            // Store the email in localStorage for session management
            localStorage.setItem('userEmail', email);

            // Redirect to dashboard
            setMessage('Login successful! Redirecting to dashboard...');
            setRedirecting(true);
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Login error:', error);
            setMessage('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div style={{
            maxWidth: '500px',
            margin: '100px auto',
            padding: '20px',
            backgroundColor: '#f9fafb',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
            <h2 style={{ color: '#1f2937', fontSize: '24px', marginBottom: '16px', textAlign: 'center' }}>
                Welcome to Goal Tracker
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '24px', textAlign: 'center' }}>
                Please sign in with your verified email
            </p>

            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '16px' }}>
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '16px'
                        }}
                    />
                </div>

                {message && (
                    <div style={{
                        padding: '10px',
                        backgroundColor: message.includes('successful') ? '#ecfdf5' : '#fee2e2',
                        color: message.includes('successful') ? '#065f46' : '#b91c1c',
                        borderRadius: '6px',
                        marginBottom: '16px',
                        textAlign: 'center'
                    }}>
                        {message}
                        {redirecting && (
                            <div style={{ marginTop: '10px' }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    borderTop: '2px solid #065f46',
                                    borderRight: '2px solid transparent',
                                    margin: '0 auto',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                            </div>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || redirecting}
                    style={{
                        width: '100%',
                        padding: '12px 0',
                        backgroundColor: '#4f46e5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        cursor: (loading || redirecting) ? 'not-allowed' : 'pointer',
                        opacity: (loading || redirecting) ? '0.7' : '1'
                    }}
                >
                    {loading ? 'Signing in...' : redirecting ? 'Redirecting...' : 'Sign in'}
                </button>
            </form>

            <style jsx global>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
} 