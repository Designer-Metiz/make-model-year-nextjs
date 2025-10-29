import { supabase, BlogPost } from '@/lib/supabase';
import { LocalBlogService } from './localBlogService';

// Re-export BlogPost for convenience
export type { BlogPost } from '@/lib/supabase';

export interface CreateBlogPostData {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  author: string;
  status: 'published' | 'draft';
  publishedDate?: string;
  readTime?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoSchema?: string;
  blogImage?: string;
  tags?: string[];
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
  id: number;
}

export class BlogService {
  // Get all blog posts
  static async getAllPosts(): Promise<BlogPost[]> {
    try {
      console.log('🔍 Fetching posts from Supabase...');
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase error fetching posts:', error);
        throw new Error(`Failed to fetch blog posts: ${error.message}`);
      }

      console.log('✅ Fetched posts from Supabase:', data?.length || 0, 'posts');
      return data || [];
    } catch (error) {
      console.error('❌ Supabase connection error, falling back to local storage:', error);
      // Fallback to local storage if Supabase is not configured
      const localPosts = await LocalBlogService.getAllPosts();
      console.log('💾 Fetched posts from local storage:', localPosts.length, 'posts');
      return localPosts;
    }
  }

  // Get published posts only
  static async getPublishedPosts(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching published posts:', error);
        throw new Error(`Failed to fetch published posts: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Supabase connection error, falling back to local storage:', error);
      return await LocalBlogService.getPublishedPosts();
    }
  }

  // Get post by ID
  static async getPostById(id: number): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      return null;
    }

    return data;
  }

  // Get post by slug
  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching post by slug:', error);
      return null;
    }

    return data;
  }

  // Create new post
  static async createPost(postData: CreateBlogPostData): Promise<BlogPost> {
    try {
      const slug = postData.slug || this.generateSlug(postData.title);
      
      console.log('🚀 Attempting to create post in Supabase:', {
        title: postData.title,
        status: postData.status,
        published: postData.status === 'published',
        slug,
        published_date: postData.publishedDate,
        read_time: postData.readTime,
        seo_title: postData.seoTitle,
        seo_description: postData.seoDescription,
        seo_schema: postData.seoSchema,
        blog_image: postData.blogImage
      });

      console.log('📊 Raw form data received:', postData);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([
          {
            title: postData.title,
            slug,
            excerpt: postData.excerpt,
            content: postData.content,
            author: postData.author,
            status: postData.status,
            published: postData.status === 'published',
            published_date: postData.publishedDate,
            read_time: postData.readTime,
            seo_title: postData.seoTitle,
            seo_description: postData.seoDescription,
            seo_schema: postData.seoSchema,
            blog_image: postData.blogImage,
            tags: postData.tags || [],
            views: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error creating post:', error);
        console.log('🔄 Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        console.log('🔄 Falling back to local storage...');
        throw new Error(`Failed to create blog post: ${error.message}`);
      }

      console.log('✅ Post created successfully in Supabase:', data);
      console.log('📋 Saved data includes:', {
        id: data.id,
        title: data.title,
        published_date: data.published_date,
        read_time: data.read_time,
        seo_title: data.seo_title,
        seo_description: data.seo_description,
        blog_image: data.blog_image
      });
      return data;
    } catch (error) {
      console.error('❌ Supabase connection error, falling back to local storage:', error);
      // Fallback to local storage if Supabase is not configured
      const localPost = await LocalBlogService.createPost(postData);
      console.log('💾 Post saved to local storage:', localPost);
      return localPost;
    }
  }

  // Update post
  static async updatePost(id: number, postData: Partial<CreateBlogPostData>): Promise<BlogPost | null> {
    try {
      console.log('🔄 Updating post with data:', {
        id,
        postData,
        publishedDate: postData.publishedDate,
        readTime: postData.readTime,
        seoTitle: postData.seoTitle,
        seoDescription: postData.seoDescription,
        blogImage: postData.blogImage
      });

      const updateData: any = {
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content,
        author: postData.author,
        status: postData.status,
        published_date: postData.publishedDate,
        read_time: postData.readTime,
        seo_title: postData.seoTitle,
        seo_description: postData.seoDescription,
        seo_schema: postData.seoSchema,
        blog_image: postData.blogImage,
        updated_at: new Date().toISOString(),
      };

      console.log('📝 Final update data for Supabase:', updateData);

      // Generate new slug if title is being updated and no custom slug provided
      if (postData.title && !postData.slug) {
        updateData.slug = this.generateSlug(postData.title);
      }

      // Update published status based on status
      if (postData.status) {
        updateData.published = postData.status === 'published';
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating post:', error);
        throw new Error('Failed to update blog post');
      }

      console.log('✅ Post updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Supabase connection error, falling back to local storage:', error);
      return await LocalBlogService.updatePost(id, postData);
    }
  }

  // Delete post
  static async deletePost(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting post:', error);
        throw new Error('Failed to delete blog post');
      }

      return true;
    } catch (error) {
      console.error('Supabase connection error, falling back to local storage:', error);
      return await LocalBlogService.deletePost(id);
    }
  }

  // Increment view count
  static async incrementViews(id: number): Promise<void> {
    const { error } = await (supabase as any).rpc('increment_views', {
      post_id: id,
    });

    if (error) {
      console.error('Error incrementing views:', error);
    }
  }

  // Search posts
  static async searchPosts(query: string): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching posts:', error);
      throw new Error('Failed to search posts');
    }

    return data || [];
  }

  // Get related posts
  static async getRelatedPosts(postId: number, limit: number = 3): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .neq('id', postId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching related posts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching related posts:', error);
      return [];
    }
  }

  // Get dashboard stats
  static async getDashboardStats() {
    try {
      const [totalResult, publishedResult, viewsResult, authorsResult] = await Promise.all([
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('blog_posts').select('views'),
        supabase.from('blog_posts').select('author').not('author', 'is', null),
      ]);

      const totalPosts = totalResult.count || 0;
      const publishedPosts = publishedResult.count || 0;
      const totalViews = viewsResult.data?.reduce((sum, post) => sum + (post.views || 0), 0) || 0;
      const uniqueAuthors = new Set(authorsResult.data?.map(post => post.author)).size;

      return {
        totalPosts,
        publishedPosts,
        draftPosts: totalPosts - publishedPosts,
        totalViews,
        uniqueAuthors,
      };
    } catch (error) {
      console.error('Supabase connection error, falling back to local storage:', error);
      return await LocalBlogService.getDashboardStats();
    }
  }

  // Generate slug from title
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}