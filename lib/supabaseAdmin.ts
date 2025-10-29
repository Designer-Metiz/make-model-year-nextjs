import { createClient } from '@supabase/supabase-js';

// Server-only Supabase client using service role key for privileged operations (bypass RLS)
export const supabaseAdmin = () =>
  createClient(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) as string,
    (process.env.SUPABASE_SERVICE_ROLE_KEY as string) || '',
    {
      auth: { persistSession: false },
    },
  );

if (process.env.NODE_ENV !== 'production') {
  const hasUrl = Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  // eslint-disable-next-line no-console
  console.log('[supabaseAdmin] Env check:', { hasUrl, hasServiceKey });
}


