import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin' | 'moderator';
  is_active: boolean;
  is_verified: boolean;
  last_login_at: string | null;
  login_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'user' | 'admin' | 'moderator';
}

export class UserService {
  // Get current user profile
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.rpc('get_current_user');
      
      if (error) {
        console.error('❌ Error fetching current user:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('❌ User service error:', error);
      return null;
    }
  }

  // Update user login activity
  static async updateLoginActivity(): Promise<void> {
    try {
      const { error } = await supabase.rpc('update_user_login');
      
      if (error) {
        console.error('❌ Error updating login activity:', error);
      }
    } catch (error) {
      console.error('❌ Login activity update error:', error);
    }
  }

  // Get all users (admin only)
  static async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching users:', error);
        throw new Error(`Failed to fetch users: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('❌ User service error:', error);
      throw error;
    }
  }

  // Update user role (admin only)
  static async updateUserRole(userId: string, role: 'user' | 'admin' | 'moderator'): Promise<User | null> {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, updates: { role } }),
      });
      if (!res.ok) throw new Error(`Failed to update user role: ${res.status}`);
      const json = await res.json();
      return json.user ?? null;
    } catch (error) {
      console.error('❌ User role update error:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<CreateUserData>): Promise<User | null> {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, updates }),
      });
      if (!res.ok) throw new Error(`Failed to update user profile: ${res.status}`);
      const json = await res.json();
      return json.user ?? null;
    } catch (error) {
      console.error('❌ User profile update error:', error);
      throw error;
    }
  }

  // Deactivate user
  static async deactivateUser(userId: string): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, updates: { is_active: false } }),
      });
      if (!res.ok) throw new Error(`Failed to deactivate user: ${res.status}`);
      return true;
    } catch (error) {
      console.error('❌ User deactivation error:', error);
      throw error;
    }
  }

  // Check if user is admin
  static async isAdmin(userId?: string): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user?.role === 'admin' || false;
    } catch (error) {
      console.error('❌ Admin check error:', error);
      return false;
    }
  }
}
