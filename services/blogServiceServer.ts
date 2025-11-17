import { supabaseServer } from '@/lib/supabaseServer';
import type { BlogPost } from '@/lib/supabase';
import { LocalBlogService } from './localBlogService';

export class BlogServiceServer {
  static async getPublishedPosts(): Promise<BlogPost[]> {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('[BlogServiceServer] getPublishedPosts error:', error);
      try {
        const fallback = await LocalBlogService.getPublishedPosts();
        console.warn('[BlogServiceServer] Falling back to LocalBlogService posts:', fallback.length);
        return fallback;
      } catch (e) {
        console.error('[BlogServiceServer] Local fallback failed:', e);
        return [];
      }
    }
    console.log('[BlogServiceServer] getPublishedPosts fetched:', data?.length || 0);
    return data || [];
  }

  static async getPostsByTag(tag: string): Promise<BlogPost[]> {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      // Assuming tags is a text[] column
      .contains('tags', [tag])
      .order('created_at', { ascending: false });
    if (error) {
      console.error('[BlogServiceServer] getPostsByTag error:', error, 'tag=', tag);
      try {
        const fallback = await LocalBlogService.getPostsByTag(tag);
        console.warn('[BlogServiceServer] Falling back to LocalBlogService getPostsByTag:', fallback.length);
        return fallback;
      } catch (e) {
        console.error('[BlogServiceServer] Local getPostsByTag fallback failed:', e);
        return [];
      }
    }
    return data || [];
  }

  static async searchPosts(query: string): Promise<BlogPost[]> {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('[BlogServiceServer] searchPosts error:', error, 'query=', query);
      try {
        const fallback = await LocalBlogService.searchPosts(query);
        console.warn('[BlogServiceServer] Falling back to LocalBlogService search:', fallback.length);
        return fallback;
      } catch (e) {
        console.error('[BlogServiceServer] Local search fallback failed:', e);
        return [];
      }
    }
    console.log('[BlogServiceServer] searchPosts fetched:', data?.length || 0, 'for query=', query);
    return data || [];
  }

  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    if (error) {
      console.error('[BlogServiceServer] getPostBySlug error:', error, 'slug=', slug);
      try {
        const fallback = await LocalBlogService.getPostBySlug(slug);
        if (fallback) console.warn('[BlogServiceServer] Falling back to LocalBlogService post for slug=', slug);
        return fallback;
      } catch (e) {
        console.error('[BlogServiceServer] Local getPostBySlug fallback failed:', e);
        return null;
      }
    }
    return data;
  }

  static async getRelatedPosts(postId: number, limit: number = 3): Promise<BlogPost[]> {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .neq('id', postId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) {
      console.error('[BlogServiceServer] getRelatedPosts error:', error, 'postId=', postId);
      try {
        const fallback = await LocalBlogService.getRelatedPosts(postId, limit);
        console.warn('[BlogServiceServer] Falling back to LocalBlogService related posts:', fallback.length);
        return fallback;
      } catch (e) {
        console.error('[BlogServiceServer] Local related fallback failed:', e);
        return [];
      }
    }
    return data || [];
  }
}


