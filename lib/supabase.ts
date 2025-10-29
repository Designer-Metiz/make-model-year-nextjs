// Use a safe client that works even if env vars are missing
export { supabase } from '@/lib/supabaseClient';

// Database types - Use Supabase generated types
import type { Database } from '@/integrations/supabase/types';
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

export interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

// Public users table interface
export interface PublicUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'moderator';
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

// User profile view interface
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'moderator';
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
  auth_created_at: string;
}


