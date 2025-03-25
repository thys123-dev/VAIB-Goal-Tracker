'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Goal = {
    id: number;
    description: string;
    target_date: string;
    status: 'pending' | 'completed' | 'failed';
    user_email: string;
    created_at: string;
};

export default function Dashboard() {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is authenticated
        const checkAuth = async () => {
            if (typeof window !== 'undefined') {
                const email = localStorage.getItem('userEmail');

                if (!email) {
                    // Redirect to login if not authenticated
                    window.location.href = '/login';
                    return;
                }

                setUserEmail(email);

                // Fetch user goals from Supabase
                try {
                    const { data, error } = await supabase
                        .from('goals')
                        .select('*')
                        .eq('user_email', email)
                        .order('created_at', { ascending: false });

                    if (error) {
                        console.error('Error fetching goals:', error);
                    } else {
                        setGoals(data || []);
                    }
                } catch (err) {
                    console.error('Failed to fetch goals:', err);
                }

                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userEmail');
        window.location.href = '/login';
    };

    // Show loading state
    if (loading) {
        return (
            <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Loading...</h1>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    borderTop: '3px solid #4f46e5',
                    borderRight: '3px solid transparent',
                    margin: '0 auto',
                    animation: 'spin 1s linear infinite'
                }}></div>

                <style jsx global>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Dashboard</h1>

            <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <p>
                    <strong>Email:</strong> {userEmail || 'Not logged in'}
                </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'inline-block',
                        padding: '10px 15px',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </div>

            <div>
                <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Your Goals</h2>
                {goals.length === 0 ? (
                    <p>No goals found. Add some goals to get started!</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {goals.map((goal) => (
                            <li
                                key={goal.id}
                                style={{
                                    padding: '15px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    marginBottom: '10px'
                                }}
                            >
                                <p><strong>{goal.description}</strong></p>
                                <p>Target Date: {new Date(goal.target_date).toLocaleDateString()}</p>
                                <p>Status: {goal.status}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
} 