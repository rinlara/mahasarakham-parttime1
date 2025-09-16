import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bjneroqndhwrqyibxslo.supabase.co"; // ใส่ URL ของโปรเจกต์คุณ
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbmVyb3FuZGh3cnF5aWJ4c2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNTkxMjcsImV4cCI6MjA2NTkzNTEyN30.hoZP6MZjt65ez8YoTwW_TRWVGf8XhuuCwvouqld-2QE"; // ใส่ anon key ของโปรเจกต์คุณ

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


