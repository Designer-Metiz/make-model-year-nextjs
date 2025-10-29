import AdminPostsPage from '@/components/admin/AdminPostsPage';

export const dynamic = 'force-dynamic';

export const generateMetadata = () => ({
  title: 'Posts | Admin | Make Model Year',
  description: 'Manage posts',
  robots: { index: false, follow: false },
});

export default function PostsPage() {
  return <AdminPostsPage />;
}


