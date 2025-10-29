import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, User, Eye, Tag, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/lib/supabase';
import { BlogServiceServer } from '@/services/blogServiceServer';

export const dynamic = 'force-dynamic';

export const generateMetadata = async () => ({
  title: 'Blog | Make Model Year',
  description: 'Discover insights, tips, and strategies to grow your business.',
});

async function getData(search: string | undefined): Promise<BlogPost[]> {
  if (search && search.trim()) return BlogServiceServer.searchPosts(search);
  return BlogServiceServer.getPublishedPosts();
}

export default async function Blog({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const posts = await getData(resolvedSearchParams?.q);
  console.log('[BlogPage] search query =', resolvedSearchParams?.q);
  console.log('[BlogPage] posts fetched =', posts.length);
  const getUniqueTags = () => {
    const allTags = posts.flatMap((post) => post.tags || []).filter((tag): tag is string => tag !== null);
    return [...new Set(allTags)];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Discover insights, tips, and strategies to grow your business with store locator technology
            </p>
            <div className="flex justify-center space-x-4">
              <form className="w-full max-w-md" action="/blog" method="get">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input name="q" placeholder="Search articles..." defaultValue={resolvedSearchParams?.q || ''} className="pl-10" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {getUniqueTags().map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-gray-100">
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-3">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {resolvedSearchParams?.q ? 'No articles found matching your search.' : 'No articles available yet.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      <div className="md:col-span-1">
                        <div className="h-48 md:h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          {post.blog_image ? (
                            <Image src={post.blog_image} alt={post.title} width={640} height={480} className="w-full h-full object-cover" />
                          ) : (
                            <Image src="/placeholder.svg" alt={post.title} width={640} height={480} className="w-full h-full object-cover" />
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2 p-6">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{post.created_at ? new Date(post.created_at as string).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views} views</span>
                          </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h2>

                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {(post.tags || []).filter((tag): tag is string => tag !== null).slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/blog/${post.slug}`}>
                              Read More
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


