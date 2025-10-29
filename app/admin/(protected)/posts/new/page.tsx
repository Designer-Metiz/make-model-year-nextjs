import PostForm from '@/components/admin/PostForm';

export const dynamic = 'force-dynamic';

export const generateMetadata = () => ({
  title: 'Create Post | Admin | Make Model Year',
  description: 'Create and publish new blog posts',
  robots: { index: false, follow: false },
});

export default function NewPostPage() {
  return (
    <div className="">
      <PostForm />
    </div>
  );
}


