import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    // Get the URL and extract query parameters
    const url = new URL(request.url);
    const goalId = url.searchParams.get('goalId');
    const status = url.searchParams.get('status');
    const token = url.searchParams.get('token');

    // Basic validation
    if (!goalId || !status || !token) {
      return new Response('Invalid request parameters', { status: 400 });
    }

    // Validate status - ensure it's only one of our allowed values
    if (!['pending', 'completed', 'incomplete'].includes(status)) {
      return new Response('Invalid status value', { status: 400 });
    }

    // In a production app, you'd validate the token here
    // For now, we'll use a simple approach

    // Get the goal to verify it exists
    const { data: goal, error: fetchError } = await supabase
      .from('goals')
      .select('*')
      .eq('id', goalId)
      .single();

    if (fetchError || !goal) {
      console.error('Error fetching goal:', fetchError);
      return new Response('Goal not found', { status: 404 });
    }

    // Update the goal status
    const { error: updateError } = await supabase
      .from('goals')
      .update({ status: status })
      .eq('id', goalId);

    if (updateError) {
      console.error('Error updating goal status:', updateError);
      return new Response('Failed to update goal status', { status: 500 });
    }

    // Redirect to a thank you page or the dashboard
    const htmlResponse = `
      <html>
        <head>
          <meta http-equiv="refresh" content="5;url=${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" />
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              margin-top: 50px;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
              background-color: #f9f9f9;
            }
            .success {
              color: #4CAF50;
              font-size: 24px;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="success">Status Updated Successfully!</h1>
            <p>Your goal status has been updated to: <strong>${status}</strong></p>
            <p>You will be redirected to the dashboard in 5 seconds...</p>
            <p>If you are not redirected, <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard">click here</a>.</p>
          </div>
        </body>
      </html>
    `;

    return new Response(htmlResponse, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error('Error updating goal status:', error);
    return new Response('An error occurred', { status: 500 });
  }
} 