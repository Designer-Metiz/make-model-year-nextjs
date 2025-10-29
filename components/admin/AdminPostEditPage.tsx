"use client";

import dynamic from 'next/dynamic';

const PostForm = dynamic(() => import('@/components/admin/PostForm'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        <span>Loading...</span>
      </div>
    </div>
  )
});

interface AdminPostEditPageProps {
  postId: string;
}

export default function AdminPostEditPage({ postId }: AdminPostEditPageProps) {
  return <PostForm postId={postId} />;
}
