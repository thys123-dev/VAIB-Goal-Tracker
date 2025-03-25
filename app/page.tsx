'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Redirect to login page
    window.location.href = '/login';
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center'
    }}>
      <div>
        <h1 style={{ marginBottom: '1rem' }}>Goal Tracker</h1>
        <p>Redirecting to login page...</p>
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          border: '3px solid #e5e7eb',
          borderTopColor: '#3b82f6',
          margin: '1rem auto',
          animation: 'spin 1s linear infinite'
        }}></div>

        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
