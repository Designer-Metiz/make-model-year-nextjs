import AdminNewUserPage from '@/components/admin/AdminNewUserPage';

export const dynamic = 'force-dynamic';

export const generateMetadata = () => ({
  title: 'New User | Admin | Make Model Year',
  description: 'Create a new user account',
  robots: { index: false, follow: false },
});

export default function NewUserPage() {
  return <AdminNewUserPage />;
}


