import '@/styles/blog-content.css';
import Link from 'next/link';
import { BlogServiceServer } from '@/services/blogServiceServer';
import type { BlogPost } from '@/lib/supabase';
import BlogDetailPage from '@/components/blog/BlogDetailPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await BlogServiceServer.getPostBySlug(resolvedParams.slug);
  if (!post) return { title: 'Article Not Found' };

  const path = `/blog/${post.slug}`;
  const metaTitle = (post.seo_title && String(post.seo_title).trim()) || post.title;
  const metaDescription = (post.seo_description && String(post.seo_description).trim()) || post.excerpt;
  const ogImages = post.blog_image ? [post.blog_image] : [];

  return {
    title: `${metaTitle} | Make Model Year Blog`,
    description: metaDescription,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'article',
      siteName: 'Make Model Year',
      title: `${metaTitle} | Make Model Year Blog`,
      description: metaDescription,
      url: path,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${metaTitle} | Make Model Year Blog`,
      description: metaDescription,
      images: post.blog_image ? [post.blog_image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await BlogServiceServer.getPostBySlug(resolvedParams.slug);
  const schemaRaw = (post as any)?.seo_schema;
  let schemaArray: any[] = [];
  if (schemaRaw !== null && schemaRaw !== undefined) {
    try {
      const parsed = typeof schemaRaw === 'string' ? JSON.parse(schemaRaw) : schemaRaw;
      if (Array.isArray(parsed)) {
        schemaArray = parsed.filter((obj) => !!obj && typeof obj === 'object' && !Array.isArray(obj));
      } else if (parsed && typeof parsed === 'object') {
        schemaArray = [parsed];
      }
    } catch {
      // ignore invalid schema
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {schemaArray.length > 0 &&
          schemaArray.map((obj, idx) => {
            try {
              const json = JSON.stringify(obj);
              return (
                <script
                  key={`schema-${idx}`}
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: json }}
                />
              );
            } catch {
              return null;
            }
          })}
        <BlogDetailPage slug={resolvedParams.slug} initialPost={post} />
      </main>
      <Footer />
    </div>
  );
}


