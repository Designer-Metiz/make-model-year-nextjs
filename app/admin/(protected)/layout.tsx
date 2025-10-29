import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata = {
  robots: { index: false, follow: false },
  title: 'Admin | Make Model Year',
  description: 'Administrative dashboard for Make Model Year content management',
};

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}


