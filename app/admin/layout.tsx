export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // Root admin segment has no layout so login/signup stay public.
  // Protected pages live under (protected)/ which wraps content.
  return children;
}


