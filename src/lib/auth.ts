import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";
import { generateUniqueId } from "./utils";

type User = {
  id: string;
  email: string;
  username: string;
  clientId: string;
  isAdmin: boolean;
  zCoins: number;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (data: {
    email: string;
    password: string;
    username: string;
    phoneNumber: string;
  }) => Promise<{ error: any }>;
  signIn: (data: {
    email: string;
    password: string;
  }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log("AuthProvider initialized");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthProvider useEffect running");
    // Check active session and set user
    const getSession = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    console.log("Fetching user profile for ID:", userId);
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching user profile:", profileError);
      setUser(null);
      return;
    }

    // Get user's Z Coins balance
    const { data: zCoinsData, error: zCoinsError } = await supabase
      .from("z_coins_balance")
      .select("balance")
      .eq("id", userId)
      .single();

    if (zCoinsError) {
      console.error("Error fetching Z Coins balance:", zCoinsError);
    }

    setUser({
      id: profile.id,
      email: profile.email,
      username: profile.username,
      clientId: profile.client_id,
      isAdmin: profile.is_admin,
      zCoins: zCoinsData?.balance || 0,
    });
  };

  const signUp = async (data: {
    email: string;
    password: string;
    username: string;
    phoneNumber: string;
  }) => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No user returned from sign up");

      // Get next client ID manually since the function might not be available yet
      let clientId = "04";
      try {
        // Try to get the next ID from the counter table
        const { data: counterData } = await supabase
          .from("client_id_counter")
          .select("next_id")
          .eq("id", 1)
          .single();

        if (counterData) {
          // Format with leading zero
          clientId = String(counterData.next_id).padStart(2, "0");

          // Update the counter
          await supabase
            .from("client_id_counter")
            .update({ next_id: counterData.next_id + 1 })
            .eq("id", 1);
        }
      } catch (counterError) {
        console.error("Error getting client ID:", counterError);
        // Continue with default "04"
      }

      // Create user profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        username: data.username,
        client_id: clientId,
        email: data.email,
        phone: data.phoneNumber,
        is_admin: false,
      });

      if (profileError) throw profileError;

      // Initialize Z Coins balance
      const { error: balanceError } = await supabase
        .from("z_coins_balance")
        .insert({
          id: authData.user.id,
          balance: 100000, // Initial balance of 100,000 Z Coins
        });

      if (balanceError) throw balanceError;

      // Create webhook for user
      const webhookUrl = `https://algoz.com/webhook/${generateUniqueId()}`;
      const { error: webhookError } = await supabase.from("webhooks").insert({
        user_id: authData.user.id,
        webhook_url: webhookUrl,
      });

      if (webhookError) throw webhookError;

      return { error: null };
    } catch (error) {
      console.error("Error during sign up:", error);
      return { error };
    }
  };

  const signIn = async (data: { email: string; password: string }) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error during sign in:", error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
