import type { MetadataRoute } from 'next';
import { BlogServiceServer } from '@/services/blogServiceServer';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Public, static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Dynamic blog posts
  const posts = await BlogServiceServer.getPublishedPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const publishedAt = (post.published_date || post.created_at || undefined) as string | undefined;
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: publishedAt ? new Date(publishedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });

  return [...staticRoutes, ...postEntries];
}


