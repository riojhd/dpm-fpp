import { createClient } from '@supabase/supabase-js';

export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-dpm-fpp.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_service_key_dpm_fpp';
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    }
  });
}
