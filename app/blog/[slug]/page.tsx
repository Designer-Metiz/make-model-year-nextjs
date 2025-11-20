import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Eye, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BlogServiceServer } from '@/services/blogServiceServer';
import type { BlogPost } from '@/lib/supabase';
import { ShareButton } from '@/components/ShareButton';

export const dynamic = 'force-dynamic';

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
  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Post not found.</p>
          <Button asChild variant="outline">
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  const relatedPosts = await BlogServiceServer.getRelatedPosts(post.id);
  const publishedAt = post.published_date ?? post.created_at;

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Structured Data (JSON-LD) */}
        {(post as any).seo_schema && (
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: String((post as any).seo_schema) }}
          />
        )}
        <div className="bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center space-x-4 mb-8">
              <Button variant="ghost" asChild>
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Link>
              </Button>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">{post.excerpt}</p>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 mb-8">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{publishedAt ? new Date(publishedAt as string).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                {post.read_time && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.read_time}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} views</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <ShareButton />
              </div>
            </div>
          </div>
        </div>

        {post.blog_image && (
          <div className="w-full mb-12">
            <div className="aspect-[16/9] w-full overflow-hidden">
              <Image src={post.blog_image} alt={post.title} width={1600} height={900} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-3">
              <article className="prose prose-lg prose-gray max-w-none">
                <div
                  className="prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: post.content as unknown as string }}
                />
              </article>

              {/* Author Bio */}
              <div className="mt-12 p-8 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.author}</h3>
                    <p className="text-gray-600">
                      Published on {post.created_at ? new Date(post.created_at as string).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Share Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Share This Article</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ShareButton />
                  </CardContent>
                </Card>

                {/* Related Articles */}
                {relatedPosts.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Related Articles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {relatedPosts.map((rp) => (
                        <div key={rp.id} className="space-y-2">
                          <Link href={`/blog/${rp.slug}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2 transition-colors">
                            {rp.title}
                          </Link>
                          <p className="text-xs text-gray-500">{rp.created_at ? new Date(rp.created_at as string).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


