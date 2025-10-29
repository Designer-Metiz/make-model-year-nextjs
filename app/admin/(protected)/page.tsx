import AdminDashboardPage from '@/components/admin/AdminDashboardPage';

export const dynamicParams = true;
export const dynamic = 'force-dynamic';

export const generateMetadata = () => ({
  title: 'Admin Dashboard | Make Model Year',
  description: 'Administrative dashboard',
  robots: { index: false, follow: false },
});

export default function AdminPage() {
  return <AdminDashboardPage />;
}


