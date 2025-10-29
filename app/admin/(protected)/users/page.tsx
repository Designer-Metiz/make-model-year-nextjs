import AdminUsersPage from '@/components/admin/AdminUsersPage';

export const dynamic = 'force-dynamic';

export const generateMetadata = () => ({
  title: 'Users | Admin | Make Model Year',
  description: 'Manage users',
  robots: { index: false, follow: false },
});

export default function UsersPage() {
  return <AdminUsersPage />;
}


