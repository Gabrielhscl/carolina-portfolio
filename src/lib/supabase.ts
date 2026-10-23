import { createClient } from '@supabase/supabase-js';

// Pega as variáveis de ambiente que configuramos no .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cria e exporta o cliente para ser usado no site todo
export const supabase = createClient(supabaseUrl, supabaseAnonKey);