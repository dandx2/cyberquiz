import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://moyidovovjshhfbciedl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veWlkb3ZvdmpzaGhmYmNpZWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MzY1ODgsImV4cCI6MjA3MjQxMjU4OH0.1_dzh36szoP0quF5H3fyTPLnAecgC-ruWOjMp8lGdYI';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
