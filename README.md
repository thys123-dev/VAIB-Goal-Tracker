# Goal Tracker

A web application to track, manage, and achieve personal and professional goals with email reminders. Built with Next.js, React, TypeScript, and Supabase.

## Features

- **Goal Submission**: Create goals with descriptions and target dates
- **User Verification**: System checks if users exist in a predefined database
- **Goal Management**: View, update status, and delete your goals
- **Email Reminders**: Receive email notifications as goal due dates approach
- **Response Handling**: Update goal status directly via email replies
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase
- **Form Handling**: React Hook Form, Zod validation
- **Email Service**: Integration ready for SendGrid, Mailgun, etc.

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- A Supabase account for database functionality

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/goal-tracker.git
cd goal-tracker
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
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
- status (text, enum: 'pending', 'completed', 'failed')
- created_at (timestamp with time zone)

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
| status      | text                   | Status: 'pending', 'completed', 'failed' |
| created_at  | timestamp with time zone | Creation timestamp                 |

## Deployment

This app can be deployed on Vercel, Netlify, or any other Next.js-compatible hosting provider.

```bash
# Build for production
npm run build
# or
yarn build
```

## License

[MIT](LICENSE)
