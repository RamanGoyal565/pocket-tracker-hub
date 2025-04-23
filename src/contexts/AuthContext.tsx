
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types/finance";
import { supabase } from "@/utils/supabaseClient";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "@/utils/finance";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (user: User) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      setIsSupabaseConfigured(false);
      toast({
        title: "Supabase Configuration Missing",
        description: "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast({
          title: "Authentication Error",
          description: "Could not connect to authentication service. Please check your Supabase configuration.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async () => {
      await checkUser();
    });

    // Initial check
    checkUser();

    // Cleanup
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [toast]);

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      toast({
        title: "Configuration Error",
        description: "Supabase is not configured. Cannot login.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      const user = await loginUser(email, password);
      if (user) {
        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    if (!isSupabaseConfigured) {
      return;
    }
    
    try {
      logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const register = async (user: User) => {
    if (!isSupabaseConfigured) {
      toast({
        title: "Configuration Error",
        description: "Supabase is not configured. Cannot register.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      const success = await registerUser(user);
      if (success) {
        setUser(user);
      }
      return success;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
