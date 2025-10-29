"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Eye, 
  FileText, 
  Users, 
  BarChart3,
  ArrowRight,
  UserPlus,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogService } from '@/services/blogService';
import { BlogPost } from '@/lib/supabase';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    uniqueAuthors: 0,
  });
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [stats, posts] = await Promise.all([
          BlogService.getDashboardStats(),
          BlogService.getAllPosts(),
        ]);
        
        setDashboardStats(stats);
        setRecentPosts(posts.slice(0, 4));
        
        // Debug helpers removed
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set default values if Supabase is not configured
        setDashboardStats({
          totalPosts: 0,
          publishedPosts: 0,
          draftPosts: 0,
          totalViews: 0,
          uniqueAuthors: 0,
        });
        setRecentPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);
  
  const stats = [
    {
      title: 'Total Posts',
      value: dashboardStats.totalPosts.toString(),
      change: '+12% from last month',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Published',
      value: dashboardStats.publishedPosts.toString(),
      change: '+8% from last month',
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Authors',
      value: dashboardStats.uniqueAuthors.toString(),
      change: '+2 from last month',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Views',
      value: dashboardStats.totalViews.toLocaleString(),
      change: '+23% from last month',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Create New Post',
      description: 'Write and publish a new article.',
      icon: Plus,
      href: '/admin/posts/new'
    },
    {
      title: 'Add New Author',
      description: 'Create a new author profile.',
      icon: UserPlus,
      href: '/admin/authors'
    },
    {
      title: 'Settings',
      description: 'Check your blog settings.',
      icon: BarChart3,
      href: '/admin/settings'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your blog.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <a href="https://makemodelyear.in/" target="_blank" rel="noopener noreferrer">
              <Eye className="mr-2 h-4 w-4" />
              View Site
            </a>
          </Button>
          <Button asChild>
            <Link href="/admin/posts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Posts</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/posts">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {post.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {post.excerpt}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(post.created_at || '').toLocaleDateString('en-US', { 
                        month: 'numeric', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No blog posts found</p>
                <p className="text-sm text-gray-400">
                  {dashboardStats.totalPosts === 0 
                    ? "Set up your Supabase database to get started" 
                    : "Create your first blog post"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="ghost"
                className="w-full justify-start h-auto p-4"
                asChild
              >
                <Link href={action.href}>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <action.icon className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{action.title}</p>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </div>
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;
