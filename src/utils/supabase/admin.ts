import { createClient } from '@supabase/supabase-js';

// Use a fallback dummy key so that the Vercel build/SSR doesn't crash if the key is missing in production.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
