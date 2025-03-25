import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { to, subject, text, html } = await req.json();

        const content = [];

        // Add text content
        if (text) {
            content.push({
                type: 'text/plain',
                value: text,
            });
        }

        // Add HTML content if provided
        if (html) {
            content.push({
                type: 'text/html',
                value: html,
            });
        }

        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [{
                    to: [{ email: to }],
                }],
                from: { email: process.env.FROM_EMAIL },
                subject: subject,
                content: content,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('SendGrid API Error:', errorText);
            throw new Error(`Email send failed: ${response.statusText}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
} 