import AdminSettingsPage from '@/components/admin/AdminSettingsPage';

export const dynamic = 'force-dynamic';

export const generateMetadata = () => ({
  title: 'Settings | Admin | Make Model Year',
  description: 'Manage settings',
  robots: { index: false, follow: false },
});

export default function SettingsPage() {
  return <AdminSettingsPage />;
}


