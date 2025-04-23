
import { createClient } from "@supabase/supabase-js";

// Make sure we have default values for the URL and key in case the env vars are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Check if supabaseUrl and supabaseKey are available
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL and/or Anon Key are missing. Please set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
