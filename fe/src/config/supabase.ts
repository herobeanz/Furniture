/**
 * Supabase client config (project lsxtuwergkagsrmayghz).
 * Dùng khi tích hợp Supabase JS; API chính vẫn qua NestJS + VITE_API_BASE_URL.
 */
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
} as const

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseConfig.url && supabaseConfig.anonKey)
}
