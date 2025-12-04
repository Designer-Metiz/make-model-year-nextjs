'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CalendarDays, Facebook, Linkedin, Loader2, Search, Share2, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { BlogPost } from '@/services/blogService';
import { useBlogPost, useBlogPosts } from '@/hooks/useBlogData';
import { AuthorService, type Author } from '@/services/authorService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Props {
  slug: string;
  initialPost?: BlogPost | null;
}

export default function BlogDetailPage({ slug, initialPost }: Props) {
  const { post, loading } = useBlogPost(slug, { initialPost });
  const { posts } = useBlogPosts();
  const [searchTerm, setSearchTerm] = useState('');
  const [author, setAuthor] = useState<Author | null>(null);

  // Load author details once post is available
  useEffect(() => {
    let active = true;
    const loadAuthor = async () => {
      if (!post?.author) {
        setAuthor(null);
        return;
      }
      try {
        const a = await AuthorService.getByName(post.author);
        if (!active) return;
        setAuthor(a);
      } catch {
        if (active) setAuthor(null);
      }
    };
    loadAuthor();
    return () => {
      active = false;
    };
  }, [post?.author]);

  function getCategory(p: BlogPost | null): string | null {
    if (!p) return null;
    const maybeCategory = (p as any).category as string | undefined;
    if (maybeCategory && typeof maybeCategory === 'string') return maybeCategory;
    return p.tags && p.tags.length > 0 ? p.tags[0] : null;
  }

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    return posts.filter((p) => {
      const title = (p.title || '').toLowerCase();
      const excerpt = (p.excerpt || '').toLowerCase();
      const content = (p.content as unknown as string || '').toLowerCase();
      const tags = (p.tags || []).join(' ').toLowerCase();
      return title.includes(q) || excerpt.includes(q) || content.includes(q) || tags.includes(q);
    });
  }, [posts, searchTerm]);

  const related = useMemo(() => {
    const currentCategory = getCategory(post);
    if (!post || !currentCategory) return [];
    return posts
      .filter((p) => p.slug !== post.slug && getCategory(p) === currentCategory)
      .slice(0, 3);
  }, [post, posts]);

  if (loading) {
    return (
      <main className="pt-20">
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading article...</span>
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const dateToDisplay = post.published_date ?? post.created_at ?? null;

  function share(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <main className="pt-20">
      <section className="py-8 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2">
              {getCategory(post) && (
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">{getCategory(post)}</Badge>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">{post.title}</h1>

              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <span>
                    {dateToDisplay
                      ? new Date(dateToDisplay as string).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      : ''}
                  </span>
                </div>
                <span>•</span>
                {post.read_time && <span>{post.read_time}</span>}
                {post.author && (
                  <>
                    <span>•</span>
                    <span>by {post.author}</span>
                  </>
                )}
              </div>

              {/* Share */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-sm font-medium text-foreground">Share:</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="p-2" onClick={() => share(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`)}>
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="p-2" onClick={() => share(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(post.title)}`)}>
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="p-2" onClick={() => share(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`)}>
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-2"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: post.title, url: currentUrl }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(currentUrl).catch(() => {});
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Featured Image */}
              {post.blog_image && (
                <Card className="overflow-hidden gradient-card border-0 shadow-card mb-8">
                  <Image
                    src={post.blog_image}
                    alt={post.title}
                    width={834}
                    height={384}
                    priority
                    sizes="(max-width: 834px) 100vw, 834px"
                    className="object-cover rounded-lg mx-auto"
                  />
                </Card>
              )}

              {/* Content */}
              <Card className="gradient-card border-0 shadow-card mb-8">
                <CardContent className="p-8">
                  <div
                    className="prose prose-lg max-w-none prose-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-foreground prose-blockquote:text-muted-foreground prose-blockquote:border-primary/20 prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: post.content as unknown as string }}
                  />
                </CardContent>
              </Card>

              {/* Author Section */}
              {author && (
                <Card className="gradient-card border-0 shadow-card mb-8">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={author.avatar_url || undefined} alt={author.name} />
                        <AvatarFallback>{author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 text-foreground">About {author.name}</h3>
                        {author.bio && <p className="text-muted-foreground mb-4">{author.bio}</p>}
                        <div className="flex gap-2">
                          {author.twitter_url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={author.twitter_url} target="_blank" rel="noopener noreferrer">
                                <Twitter className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          {author.linkedin_url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={author.linkedin_url} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          {author.facebook_url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={author.facebook_url} target="_blank" rel="noopener noreferrer">
                                <Facebook className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Search */}
              <Card className="gradient-card border-0 shadow-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Search Blog</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary"
                    />
                  </div>
                  {searchTerm && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">{filtered.length} result(s) found</p>
                      <div className="space-y-2">
                        {filtered.slice(0, 3).map((p) => (
                          <Link key={p.id} href={`/blog/${p.slug}`} className="block p-2 hover:bg-background/50 rounded transition-colors">
                            <p className="text-sm font-medium text-foreground line-clamp-2">{p.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{p.tags?.[0] || ''}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Related */}
              {related.length > 0 && (
                <Card className="gradient-card border-0 shadow-card">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">Related Articles</h3>
                    <div className="space-y-4">
                      {related.map((rp) => (
                        <Link key={rp.id} href={`/blog/${rp.slug}`} className="block group">
                          <div className="flex gap-3">
                            {rp.blog_image ? (
                              <Image
                                src={rp.blog_image}
                                alt={rp.title || ''}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-muted" />
                            )}
                            <div className="flex-1">
                              <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2 text-foreground">
                                {rp.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {rp.created_at
                                  ? new Date(rp.created_at as string).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })
                                  : ''}
                              </p>
                              {rp.tags && rp.tags.length > 0 && (
                                <Badge variant="secondary" className="mt-1 text-xs">
                                  {rp.tags[0]}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


