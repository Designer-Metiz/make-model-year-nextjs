import { supabase } from '@/lib/supabase';
import type { Database } from '@/integrations/supabase/types';

export type Author = Database['public']['Tables']['authors']['Row'];
export type CreateAuthorData = Database['public']['Tables']['authors']['Insert'];
export type UpdateAuthorData = Database['public']['Tables']['authors']['Update'];

// Local fallback storage
const STORAGE_KEY = 'local-authors';

const loadLocal = (): Author[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocal = (authors: Author[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authors));
  } catch {}
};

let localId = 1;

export class AuthorService {
  static async list(): Promise<Author[]> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    } catch {
      const authors = loadLocal();
      return authors;
    }
  }

  static async getByName(name: string): Promise<Author | null> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .ilike('name', name) // case-insensitive match
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data as Author) ?? null;
    } catch {
      const authors = loadLocal();
      const found = authors.find(a => a.name.toLowerCase() === name.toLowerCase());
      return found ?? null;
    }
  }

  static async create(payload: CreateAuthorData): Promise<Author> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .insert([{ ...payload }])
        .select()
        .single();
      if (error) throw error;
      return data as Author;
    } catch {
      const authors = loadLocal();
      const newAuthor: Author = {
        id: (authors.at(0)?.id ?? 0) + localId++,
        name: payload.name,
        bio: payload.bio ?? null,
        avatar_url: payload.avatar_url ?? null,
        twitter_url: payload.twitter_url ?? null,
        linkedin_url: payload.linkedin_url ?? null,
        facebook_url: payload.facebook_url ?? null,
        is_active: payload.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const updated = [newAuthor, ...authors];
      saveLocal(updated);
      return newAuthor;
    }
  }

  static async update(id: number, payload: UpdateAuthorData): Promise<Author | null> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Author;
    } catch {
      const authors = loadLocal();
      const index = authors.findIndex(a => a.id === id);
      if (index === -1) return null;
      const updatedAuthor: Author = { ...authors[index], ...payload, updated_at: new Date().toISOString() } as Author;
      authors[index] = updatedAuthor;
      saveLocal(authors);
      return updatedAuthor;
    }
  }

  static async deactivate(id: number, isActive: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('authors')
        .update({ is_active: isActive })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch {
      const authors = loadLocal();
      const idx = authors.findIndex(a => a.id === id);
      if (idx === -1) return false;
      authors[idx].is_active = isActive;
      saveLocal(authors);
      return true;
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      // First check if author is being used in any blog posts
      const { data: posts, error: checkError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('author', id)
        .limit(1);
      
      if (checkError) {
        console.error('Error checking author usage:', checkError);
        throw checkError;
      }
      
      if (posts && posts.length > 0) {
        throw new Error('Cannot delete author: Author is being used in blog posts');
      }
      
      // If not used, proceed with deletion
      const { error } = await supabase
        .from('authors')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      
      console.log('✅ Author deleted successfully from database');
      return true;
    } catch (error) {
      console.error('❌ AuthorService delete error:', error);
      
      // Fallback to local storage
      try {
        const authors = loadLocal();
        const filtered = authors.filter(a => a.id !== id);
        saveLocal(filtered);
        console.log('✅ Author deleted from local storage');
        return true;
      } catch (localError) {
        console.error('❌ Local storage delete error:', localError);
        throw error; // Re-throw the original error
      }
    }
  }
}



