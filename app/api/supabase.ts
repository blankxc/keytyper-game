import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qtfkkovazlzfchpgmoqs.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
if (!supabaseKey) {
    throw new Error('db key not found')
}
export const supabase = createClient(supabaseUrl, supabaseKey)