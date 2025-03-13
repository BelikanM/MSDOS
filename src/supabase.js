
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = 'https://gtkdgvgjshmrnrvyyccj.supabase.co';
   const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFqc2htcm5ydnl5Y2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NDc1MTIsImV4cCI6MjA1NzAyMzUxMn0.-Ggz-qR2uSmfwZb7z9Uf_Yd8EvuGuHTRUkbs5rg5gPo';

   const supabase = createClient(supabaseUrl, supabaseAnonKey);

   export default supabase;
   
