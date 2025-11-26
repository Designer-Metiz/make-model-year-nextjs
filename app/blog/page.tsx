import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, User, Eye, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BlogPost } from '@/lib/supabase';
import { BlogServiceServer } from '@/services/blogServiceServer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BlogClient } from '@/components/blog/BlogClient';

export const dynamic = 'force-dynamic';

export const generateMetadata = async () => ({
  title: 'Make Model Year Blog – Car Tips, Guides & Updates',
  description:
    'Find useful tips, guides, and updates on car make, model, and year details. Stay informed with clear insights that support better decisions. Visit the blog now.',
});

async function getData(): Promise<BlogPost[]> {
  return BlogServiceServer.getPublishedPosts();
}

export default async function Blog() {
  const posts = await getData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Discover insights, tips, and strategies to grow your business with store locator technology
            </p>
          </div>
        </div>
      </div>

      <BlogClient posts={posts} />
      <Footer />
    </div>
  );
}


