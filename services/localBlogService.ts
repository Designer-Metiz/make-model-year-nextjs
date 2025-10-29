import type { BlogPost } from '@/lib/supabase';

export interface CreateBlogPostData {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  status: 'published' | 'draft';
  tags?: string[];
  blog_image?: string;
}

// Local storage key
const STORAGE_KEY = 'local-blog-posts';

// Helper functions for localStorage
const loadPostsFromStorage = (): BlogPost[] => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('[LocalBlogService] localStorage not available (server-side), returning empty array');
      return [];
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading posts from storage:', error);
  }
  return [];
};

const savePostsToStorage = (posts: BlogPost[]) => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('[LocalBlogService] localStorage not available (server-side), skipping save');
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving posts to storage:', error);
  }
};

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Get next ID
const getNextId = (): number => {
  const posts = loadPostsFromStorage();
  return Math.max(...posts.map(post => post.id), 0) + 1;
};

export class LocalBlogService {
  // Get all blog posts
  static async getAllPosts(): Promise<BlogPost[]> {
    return loadPostsFromStorage();
  }

  // Get published posts only
  static async getPublishedPosts(): Promise<BlogPost[]> {
    const posts = loadPostsFromStorage();
    return posts.filter(post => post.published);
  }

  // Get post by ID
  static async getPostById(id: number): Promise<BlogPost | null> {
    const posts = loadPostsFromStorage();
    return posts.find(post => post.id === id) || null;
  }

  // Get post by slug
  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const posts = loadPostsFromStorage();
    return posts.find(post => post.slug === slug && post.published) || null;
  }

  // Create new post
  static async createPost(postData: CreateBlogPostData): Promise<BlogPost> {
    const posts = loadPostsFromStorage();
    const newPost: BlogPost = {
      ...postData,
      id: getNextId(),
      slug: generateSlug(postData.title),
      published: postData.status === 'published',
      views: 0,
      tags: postData.tags || null,
      blog_image: postData.blog_image || null,
      published_date: null,
      read_time: null,
      seo_description: null,
      seo_title: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    posts.push(newPost);
    savePostsToStorage(posts);
    return newPost;
  }

  // Update post
  static async updatePost(id: number, postData: Partial<CreateBlogPostData>): Promise<BlogPost | null> {
    const posts = loadPostsFromStorage();
    const postIndex = posts.findIndex(post => post.id === id);
    
    if (postIndex === -1) return null;

    const updatedPost = {
      ...posts[postIndex],
      ...postData,
      id, // Ensure ID doesn't change
      slug: postData.title ? generateSlug(postData.title) : posts[postIndex].slug,
      published: postData.status ? postData.status === 'published' : posts[postIndex].published,
      updated_at: new Date().toISOString(),
    };

    posts[postIndex] = updatedPost;
    savePostsToStorage(posts);
    return updatedPost;
  }

  // Delete post
  static async deletePost(id: number): Promise<boolean> {
    const posts = loadPostsFromStorage();
    const postIndex = posts.findIndex(post => post.id === id);
    
    if (postIndex === -1) return false;

    posts.splice(postIndex, 1);
    savePostsToStorage(posts);
    return true;
  }

  // Increment view count
  static async incrementViews(id: number): Promise<void> {
    const posts = loadPostsFromStorage();
    const post = posts.find(p => p.id === id);
    if (post) {
      post.views = (post.views || 0) + 1;
      savePostsToStorage(posts);
    }
  }

  // Search posts
  static async searchPosts(query: string): Promise<BlogPost[]> {
    const posts = loadPostsFromStorage();
    const lowercaseQuery = query.toLowerCase();
    return posts.filter(post => 
      post.published && (
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.excerpt.toLowerCase().includes(lowercaseQuery) ||
        (post.tags || []).some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    );
  }

  // Get posts by tag
  static async getPostsByTag(tag: string): Promise<BlogPost[]> {
    const posts = loadPostsFromStorage();
    return posts.filter(post => 
      post.published && 
      (post.tags || []).some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  // Get related posts
  static async getRelatedPosts(postId: number, limit: number = 3): Promise<BlogPost[]> {
    const posts = loadPostsFromStorage();
    const currentPost = posts.find(post => post.id === postId);
    
    if (!currentPost) return [];

    // Find posts with similar tags or same author
    const relatedPosts = posts.filter(post => 
      post.id !== postId && 
      post.published && (
        (currentPost.tags && post.tags && 
         currentPost.tags.some(tag => post.tags!.includes(tag))) ||
        post.author === currentPost.author
      )
    );

    // Sort by relevance (more matching tags first) and then by date
    relatedPosts.sort((a, b) => {
      const aTagMatches = currentPost.tags ? 
        (a.tags || []).filter(tag => currentPost.tags!.includes(tag)).length : 0;
      const bTagMatches = currentPost.tags ? 
        (b.tags || []).filter(tag => currentPost.tags!.includes(tag)).length : 0;
      
      if (aTagMatches !== bTagMatches) {
        return bTagMatches - aTagMatches;
      }
      
      const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bDate - aDate;
    });

    return relatedPosts.slice(0, limit);
  }

  // Get dashboard stats
  static async getDashboardStats() {
    const posts = loadPostsFromStorage();
    const totalPosts = posts.length;
    const publishedPosts = posts.filter(post => post.published).length;
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const uniqueAuthors = new Set(posts.map(post => post.author)).size;

    return {
      totalPosts,
      publishedPosts,
      draftPosts: totalPosts - publishedPosts,
      totalViews,
      uniqueAuthors,
    };
  }
}
