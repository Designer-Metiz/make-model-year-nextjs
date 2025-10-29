import { useState, useEffect } from 'react';
import { BlogService } from '@/services/blogService';
import { BlogPost } from '@/lib/supabase';

export const useBlogData = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Load posts from service
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const publishedPosts = await BlogService.getPublishedPosts();
        setPosts(publishedPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };

    // Initial load
    loadPosts();

    // Also refresh when window gains focus
    const handleFocus = () => {
      loadPosts();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const refresh = async () => {
    try {
      const publishedPosts = await BlogService.getPublishedPosts();
      setPosts(publishedPosts);
    } catch (error) {
      console.error('Error refreshing posts:', error);
    }
  };

  return { posts, refresh };
};

export const useBlogPost = (slug: string) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (slug) {
        try {
          setLoading(true);
          const foundPost = await BlogService.getPostBySlug(slug);
          if (foundPost) {
            setPost(foundPost);
            // Get related posts
            const related = await BlogService.getRelatedPosts(foundPost.id);
            setRelatedPosts(related);
            // Increment view count
            await BlogService.incrementViews(foundPost.id);
          }
        } catch (error) {
          console.error('Error loading post:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    // Initial load
    loadPost();

    // Also refresh when window gains focus
    const handleFocus = () => {
      loadPost();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [slug]);

  return { post, relatedPosts, loading };
};
