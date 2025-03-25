-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email TEXT NOT NULL REFERENCES users(email),
    description TEXT NOT NULL,
    target_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add test users
INSERT INTO users (email, verified) VALUES
    ('john.doe@example.com', true),
    ('jane.smith@example.com', true),
    ('mike.wilson@example.com', true),
    ('sarah.jones@example.com', true),
    ('alex.brown@example.com', true)
ON CONFLICT (email) DO NOTHING;

-- Add some test goals
INSERT INTO goals (user_email, description, target_date, status) VALUES
    ('john.doe@example.com', 'Complete project documentation', '2024-04-15', 'pending'),
    ('john.doe@example.com', 'Review pull requests', '2024-04-10', 'completed'),
    ('jane.smith@example.com', 'Prepare presentation slides', '2024-04-20', 'pending'),
    ('mike.wilson@example.com', 'Update website content', '2024-04-25', 'pending'),
    ('sarah.jones@example.com', 'Schedule team meeting', '2024-04-12', 'completed'),
    ('alex.brown@example.com', 'Write blog post', '2024-04-18', 'pending')
ON CONFLICT DO NOTHING; 