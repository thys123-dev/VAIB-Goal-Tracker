// This script can be run by a scheduler like cron
// e.g., "0 9 * * * node scripts/check-due-goals.js" would run it daily at 9 AM

const fetch = require('node-fetch');
const endpoint = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function checkDueGoals() {
    try {
        console.log('Checking due goals...');
        const response = await fetch(`${endpoint}/api/check-due-goals`);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Check complete:', data);
    } catch (error) {
        console.error('Error checking due goals:', error);
    }
}

// Execute the function
checkDueGoals(); 