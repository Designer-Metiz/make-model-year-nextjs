'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import type { BlogPost } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface BlogSidebarClientProps {
  posts: BlogPost[];
}

export function BlogSidebarClient({ posts }: BlogSidebarClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    return posts.filter((p) => {
      const title = (p.title || '').toLowerCase();
      const tagString = (p.tags || []).join(' ').toLowerCase();
      const excerpt = (p.excerpt || '').toLowerCase();
      return title.includes(q) || tagString.includes(q) || excerpt.includes(q);
    });
  }, [posts, searchTerm]);

  return (
    <Card className="gradient-card border-0 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">Search Blog</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
              {filtered.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block p-2 hover:bg-background/50 rounded transition-colors"
                >
                  <p className="text-sm font-medium text-foreground line-clamp-2">{post.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{post.tags?.[0] || ''}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


