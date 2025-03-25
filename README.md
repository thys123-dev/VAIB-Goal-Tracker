# Goal Tracker

A web application to track, manage, and achieve personal and professional goals with email reminders. Built with Next.js, React, TypeScript, and Supabase.

## Features

- **Goal Management**: Create, track, and delete goals with target dates
- **Email Notifications**: 
  - Receive confirmation emails when goals are added
  - Get reminders on the due date of your goals
  - Interactive email responses (mark goals as completed or incomplete directly from email)
- **Status Tracking**: Mark goals as completed or incomplete
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **User Authentication**: Simple email-based verification system

## Tech Stack

- **Frontend**: Next.js 13+, React, TypeScript
- **Backend**: Next.js API Routes, Server Components
- **Database**: Supabase (PostgreSQL)
- **Email Service**: SendGrid API for email notifications
- **Deployment**: Vercel with scheduled cron jobs

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- A Supabase account (free tier works fine)
- SendGrid account for email functionality

### Setup

1. Clone the repository:

```bash
git clone https://github.com/thys123-dev/VAIB-Goal-Tracker.git
cd VAIB-Goal-Tracker/goal-tracker
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Email Service Configuration (SendGrid)
EMAIL_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=your_verified_sender_email_here

# Application URL (for email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up the Supabase database:

Create the following tables in your Supabase project:

**users:**
- id (int8, primary key)
- email (text, unique)
- created_at (timestamp with time zone)

**goals:**
- id (int8, primary key)
- user_email (text, foreign key to users.email)
- description (text)
- target_date (date)
- status (text, enum: 'pending', 'completed', 'incomplete')
- created_at (timestamp with time zone)

You can use this SQL to create your tables:

```sql
-- Create users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create goals table
CREATE TABLE goals (
  id BIGSERIAL PRIMARY KEY,
  user_email TEXT REFERENCES users(email),
  description TEXT NOT NULL,
  target_date DATE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'incomplete')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX goals_user_email_idx ON goals(user_email);
CREATE INDEX goals_target_date_idx ON goals(target_date);
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Email Functionality

This application uses SendGrid for sending emails. Two types of emails are sent:

1. **Confirmation emails** when a goal is added
2. **Due date reminders** when a goal's target date is reached

The reminder emails include interactive buttons that allow users to mark goals as:
- Completed (Green button)
- Incomplete (Red button)

### Setting up SendGrid

1. Create a SendGrid account
2. Create an API key with Mail Send permissions
3. Verify a sender email address in SendGrid
4. Add these details to your `.env.local` file

## Daily Goal Checks for Reminder Emails

The application includes a feature to scan for goals due on the current day and send reminder emails. In local development, you can trigger this manually:

```bash
npm run check-goals
```

### Setting up Automated Reminders on Vercel

For production, a Vercel cron job is configured to run daily checks automatically:

1. The `vercel.json` file includes a cron job that runs at 9 AM daily
2. This job calls the `/api/check-due-goals` endpoint
3. When deploying to Vercel, make sure to set all environment variables

## Deployment

This app is designed to be deployed on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set all environment variables in the Vercel dashboard:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - EMAIL_API_KEY
   - FROM_EMAIL
   - NEXT_PUBLIC_APP_URL (set to your Vercel deployment URL)
4. Deploy your application

After deployment, Vercel will automatically set up the cron job for daily goal checks.

## Database Schema

### Users Table

| Column     | Type                   | Description            |
|------------|------------------------|------------------------|
| id         | int8                   | Primary key            |
| email      | text                   | User's email (unique)  |
| created_at | timestamp with time zone | Creation timestamp   |

### Goals Table

| Column      | Type                   | Description                          |
|-------------|------------------------|--------------------------------------|
| id          | int8                   | Primary key                          |
| user_email  | text                   | Foreign key to users.email           |
| description | text                   | Goal description                     |
| target_date | date                   | Goal target completion date          |
| status      | text                   | Status: 'pending', 'completed', 'incomplete' |
| created_at  | timestamp with time zone | Creation timestamp                 |

## Application Flow

1. **Login Page**: Users enter their email
2. **Dashboard**: After verification, users can:
   - View all their goals with status and target dates
   - Add new goals with descriptions and target dates
   - Mark goals as complete or incomplete
   - Delete goals
3. **Email Interactions**: Users receive emails and can interact with them to update goal status

## License

[MIT](LICENSE)
