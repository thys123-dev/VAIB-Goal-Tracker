import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// This function can be called via a scheduled task (e.g., cron job)
export async function GET() {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Query Supabase for goals due today that are not completed
    const { data: dueGoals, error } = await supabase
      .from('goals')
      .select('*')
      .eq('target_date', today)
      .neq('status', 'completed');

    if (error) {
      throw error;
    }

    console.log(`Found ${dueGoals?.length || 0} goals due today`);

    // Send email for each due goal
    const emailPromises = (dueGoals || []).map(async (goal) => {
      // Generate a secure token for this goal update
      // In a production app, we'd store these tokens securely with expiration
      const token = Buffer.from(`${goal.id}-${Date.now()}`).toString('base64');

      // Create the email content with HTML buttons
      const emailHtml = `
        <html>
          <body>
            <h1>Goal Reminder</h1>
            <p>Your goal is due today:</p>
            <p><strong>${goal.description}</strong></p>
            
            <p>Have you completed this goal?</p>
            
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td style="padding: 12px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/update-goal-status?goalId=${goal.id}&status=completed&token=${token}" 
                     style="padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; display: inline-block;">
                    Yes, I completed it
                  </a>
                </td>
                <td style="padding: 12px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/update-goal-status?goalId=${goal.id}&status=incomplete&token=${token}" 
                     style="padding: 12px 24px; background-color: #f44336; color: white; text-decoration: none; border-radius: 4px; display: inline-block;">
                    No, still working on it
                  </a>
                </td>
              </tr>
            </table>
            
            <p>You can also update your goals on the dashboard.</p>
          </body>
        </html>
      `;

      // Send the email via SendGrid
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: goal.user_email,
          subject: 'Goal Due Today - Action Required',
          text: `Your goal "${goal.description}" is due today.`,
          html: emailHtml
        }),
      });

      return response.ok;
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter(Boolean).length;

    return NextResponse.json({
      success: true,
      message: `Processed ${dueGoals?.length || 0} goals, sent ${successCount} emails.`
    });

  } catch (error) {
    console.error('Error checking due goals:', error);
    return NextResponse.json(
      { error: 'Failed to check due goals' },
      { status: 500 }
    );
  }
} 