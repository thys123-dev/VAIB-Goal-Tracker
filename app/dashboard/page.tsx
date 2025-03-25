'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Goal = {
    id: number;
    description: string;
    target_date: string;
    status: 'pending' | 'completed' | 'incomplete';
    user_email: string;
    created_at: string;
};

export default function Dashboard() {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [newGoal, setNewGoal] = useState('');
    const [targetDate, setTargetDate] = useState('');

    useEffect(() => {
        // Set default target date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setTargetDate(tomorrow.toISOString().split('T')[0]);

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

    const handleAddGoal = async () => {
        if (!newGoal.trim() || !userEmail || !targetDate) return;

        try {
            const { data, error } = await supabase
                .from('goals')
                .insert([
                    {
                        description: newGoal,
                        user_email: userEmail,
                        target_date: targetDate,
                        status: 'pending',
                        created_at: new Date().toISOString()
                    }
                ])
                .select();

            if (error) throw error;
            setGoals([...goals, ...data]);
            setNewGoal('');

            // Send confirmation email
            try {
                const emailResponse = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: userEmail,
                        subject: 'New Goal Added',
                        text: `Your new goal has been added successfully!\n\nGoal: ${newGoal}\nTarget Date: ${new Date(targetDate).toLocaleDateString()}\nStatus: Pending\nDate Added: ${new Date().toLocaleDateString()}\n\nKeep up the great work!`
                    }),
                });

                if (!emailResponse.ok) {
                    console.error('Failed to send confirmation email');
                }
            } catch (emailError) {
                console.error('Error sending confirmation email:', emailError);
            }
        } catch (error) {
            console.error('Error adding goal:', error);
        }
    };

    const handleDeleteGoal = async (goalId: number) => {
        if (!userEmail) return;

        try {
            const { error } = await supabase
                .from('goals')
                .delete()
                .eq('id', goalId)
                .eq('user_email', userEmail);

            if (error) throw error;

            setGoals(goals.filter(goal => goal.id !== goalId));
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    const handleComplete = async (goalId: number) => {
        if (!userEmail) return;

        try {
            const { error } = await supabase
                .from('goals')
                .update({ status: 'completed' })
                .eq('id', goalId)
                .eq('user_email', userEmail);

            if (error) throw error;

            setGoals(goals.map(goal =>
                goal.id === goalId ? { ...goal, status: 'completed' } : goal
            ));
        } catch (error) {
            console.error('Error completing goal:', error);
        }
    };

    const handleIncomplete = async (goalId: number) => {
        if (!userEmail) return;

        try {
            const { error } = await supabase
                .from('goals')
                .update({ status: 'incomplete' })
                .eq('id', goalId)
                .eq('user_email', userEmail);

            if (error) throw error;

            setGoals(goals.map(goal =>
                goal.id === goalId ? { ...goal, status: 'incomplete' } : goal
            ));
        } catch (error) {
            console.error('Error marking goal as incomplete:', error);
        }
    };

    // Get today's date in YYYY-MM-DD format for min attribute
    const today = new Date().toISOString().split('T')[0];

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
                        padding: '8px 10px',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: '90px',
                        textAlign: 'center',
                        fontSize: '14px'
                    }}
                >
                    Logout
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Add New Goal</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                        type="text"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Enter your goal"
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '4px'
                        }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                                Target Date:
                            </label>
                            <input
                                type="date"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                min={today}
                                style={{
                                    width: '100%',
                                    padding: '9px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>
                        <button
                            onClick={handleAddGoal}
                            style={{
                                padding: '8px 10px',
                                background: '#22c55e',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                width: '90px',
                                textAlign: 'center',
                                fontSize: '14px',
                                alignSelf: 'flex-end'
                            }}
                        >
                            Add Goal
                        </button>
                    </div>
                </div>
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
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p><strong>{goal.description}</strong></p>
                                        <p>Target Date: {new Date(goal.target_date).toLocaleDateString()}</p>
                                        <p>Status: {
                                            goal.status === 'completed' ? (
                                                <span style={{
                                                    fontWeight: 'bold',
                                                    color: '#10b981',
                                                    fontSize: '17px',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {goal.status}
                                                </span>
                                            ) : goal.status === 'incomplete' ? (
                                                <span style={{
                                                    fontWeight: 'bold',
                                                    color: '#dc2626',
                                                    fontSize: '17px',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {goal.status}
                                                </span>
                                            ) : goal.status
                                        }</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => handleDeleteGoal(goal.id)}
                                            style={{
                                                padding: '6px 8px',
                                                background: '#000000',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                width: '80px',
                                                textAlign: 'center',
                                                fontSize: '13px'
                                            }}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handleComplete(goal.id)}
                                            disabled={goal.status === 'completed'}
                                            style={{
                                                padding: '6px 8px',
                                                background: goal.status === 'completed' ? '#9ca3af' : '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: goal.status === 'completed' ? 'not-allowed' : 'pointer',
                                                opacity: goal.status === 'completed' ? 0.7 : 1,
                                                width: '80px',
                                                textAlign: 'center',
                                                fontSize: '13px'
                                            }}
                                        >
                                            {goal.status === 'completed' ? 'Done' : 'Complete'}
                                        </button>
                                        <button
                                            onClick={() => handleIncomplete(goal.id)}
                                            disabled={goal.status === 'incomplete'}
                                            style={{
                                                padding: '6px 8px',
                                                background: goal.status === 'incomplete' ? '#9ca3af' : '#dc2626',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: goal.status === 'incomplete' ? 'not-allowed' : 'pointer',
                                                opacity: goal.status === 'incomplete' ? 0.7 : 1,
                                                width: '80px',
                                                textAlign: 'center',
                                                fontSize: '13px'
                                            }}
                                        >
                                            {goal.status === 'incomplete' ? 'Not Done' : 'Not Done'}
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
} 