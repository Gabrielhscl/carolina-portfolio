import { createBrowserClient } from '@supabase/ssr';

// O createBrowserClient do pacote @supabase/ssr salva a sessão em cookies,
// permitindo que o proxy.ts (que roda no servidor) consiga ler e validar o login.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);