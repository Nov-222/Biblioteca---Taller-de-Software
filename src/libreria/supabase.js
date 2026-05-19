import { createClient } from '@supabase/supabase-js'

const Url = import.meta.env.VITE_SUPABASE_URL
const Key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const conexion = createClient(Url, Key)