import { createClient } from '@supabase/supabase-js';

export const supabaseServer = () =>
  createClient(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      auth: { persistSession: false }
    }
  );

// Basic diagnostics (do not log secrets)
if (process.env.NODE_ENV !== 'production') {
  const hasUrl = Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const hasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  // eslint-disable-next-line no-console
  console.log('[supabaseServer] Env check:', { hasUrl, hasServiceKey, hasAnonKey });
}

