import { createClient } from '@supabase/supabase-js';

// Check if the Supabase URL and anon key are provided
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ibhxlryahjqfqqzpimlt.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaHhscnlhaGpxZnFxenBpbWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MDM4MTEsImV4cCI6MjA1ODM3OTgxMX0.4aT0PI_E1lDbOpVlV_WWnifL0osbl3w594COuKjpP3s';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false
    }
}); 