import AdminAuthorsPage from '@/components/admin/AdminAuthorsPage';

export const dynamic = 'force-dynamic';

export const generateMetadata = () => ({
  title: 'Authors | Admin | Make Model Year',
  description: 'Manage authors',
  robots: { index: false, follow: false },
});

export default function AuthorsPage() {
  return <AdminAuthorsPage />;
}


