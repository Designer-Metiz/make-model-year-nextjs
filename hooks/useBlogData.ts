import { useState, useEffect } from 'react';
import { BlogService } from '@/services/blogService';
import { BlogPost } from '@/lib/supabase';

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load posts from service
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const publishedPosts = await BlogService.getPublishedPosts();
        setPosts(publishedPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    loadPosts();

    // No focus-based refresh to avoid jarring reloads when switching tabs
    return () => {};
  }, []);

  const refresh = async () => {
    try {
      const publishedPosts = await BlogService.getPublishedPosts();
      setPosts(publishedPosts);
    } catch (error) {
      console.error('Error refreshing posts:', error);
    }
  };

  return { posts, loading, error, refresh };
};

export const useBlogPost = (slug: string, options?: { initialPost?: BlogPost | null }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (slug) {
        try {
          // Hydrate with initial post if provided
          if (options?.initialPost && !post) {
            setPost(options.initialPost);
            setLoading(false);
          }

          // Only fetch if we don't have data yet
          if (!options?.initialPost) {
            setLoading(true);
          }
          setError(null);
          if (!options?.initialPost) {
            const foundPost = await BlogService.getPostBySlug(slug);
            if (foundPost) {
              setPost(foundPost);
              // Increment view count
              await BlogService.incrementViews(slug);
            }
          }
        } catch (error) {
          console.error('Error loading post:', error);
          setError(error as Error);
        } finally {
          setLoading(false);
        }
      }
    };

    // Initial load
    loadPost();

    // No focus-based refresh to avoid reload when switching tabs
    return () => {
      // noop
    };
  }, [slug]);

  return { post, loading, error };
};
