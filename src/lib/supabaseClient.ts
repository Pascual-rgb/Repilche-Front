import { createClient } from '@supabase/supabase-js';

// Sanitizar la URL para garantizar que sea la URL base del proyecto (sin /rest/v1 ni barras finales)
let supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
if (supabaseUrl.includes('/rest/v1')) {
  supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '');
}
supabaseUrl = supabaseUrl.replace(/\/+$/, '');

const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Faltan variables de entorno de Supabase (VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY). Asegurate de definirlas en tu archivo .env.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

