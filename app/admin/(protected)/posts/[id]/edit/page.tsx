import AdminPostEditPage from '@/components/admin/AdminPostEditPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return {
    title: `Edit Post ${resolvedParams.id} | Admin | Make Model Year`,
    description: `Edit blog post with ID ${resolvedParams.id}`,
    robots: { index: false, follow: false },
  };
}

export default async function PostEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <AdminPostEditPage postId={resolvedParams.id} />;
}


