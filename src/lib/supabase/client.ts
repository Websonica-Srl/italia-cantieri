import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Limita la cache di Next a 60s sulle fetch Supabase: le pagine restano SSG/ISR
// ma i dati non vengono congelati da force-cache/.next/cache tra i build.
const cachedFetch: typeof fetch = (input, init) =>
  fetch(input as any, { ...(init as any), next: { revalidate: 60 } });

let cached: ReturnType<typeof createClient> | null = null;

// Server-side client (satellite, solo anon key, NO auth). Singleton.
export function createServerClient() {
  if (!cached) {
    cached = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { fetch: cachedFetch },
    });
  }
  return cached;
}

// Alias di compatibilita': i satelliti usano lo stesso client anon.
export function createSatelliteClient() {
  return createServerClient();
}
