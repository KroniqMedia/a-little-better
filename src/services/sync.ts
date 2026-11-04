/**
 * Future cloud sync (not active in the MVP).
 *
 * The app runs fully offline with local repositories. When accounts are
 * introduced, set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY,
 * then implement `FavoritesRepository` / `PreferencesRepository` against a
 * Supabase table, e.g.
 *
 *   create table favorites (
 *     user_id uuid references auth.users not null,
 *     message_id text not null,
 *     saved_at timestamptz not null default now(),
 *     primary key (user_id, message_id)
 *   );
 *
 * The client is created lazily, only when credentials exist, so the MVP
 * never requires Supabase configuration to run.
 */
import type { SupabaseClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isCloudSyncConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

export async function getSupabase(): Promise<SupabaseClient | null> {
  if (!isCloudSyncConfigured) return null;
  if (!client) {
    const { createClient } = await import('@supabase/supabase-js');
    const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
    client = createClient(url!, anonKey!, {
      auth: { storage: AsyncStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    });
  }
  return client;
}
