
import { createClient } from "@supabase/supabase-js";

// Make sure we have default values for the URL and key in case the env vars are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Check if supabaseUrl and supabaseKey are available
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL and/or Anon Key are missing. Please set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.");
}

// Create a mock client if Supabase credentials are missing
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : {
      // Mock implementation of required methods
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signUp: async () => ({ data: null, error: new Error("Supabase not configured") }),
        signInWithPassword: async () => ({ data: { user: null }, error: new Error("Supabase not configured") }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({ data: null, error: new Error("Supabase not configured") }),
          order: () => ({ data: null, error: new Error("Supabase not configured") }),
        }),
        insert: () => ({ error: new Error("Supabase not configured") }),
        delete: () => ({ error: new Error("Supabase not configured") }),
      }),
    };
