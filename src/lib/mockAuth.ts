import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

// Mock user data storage
const STORAGE_KEY = "algoz_users";
const CURRENT_USER_KEY = "algoz_current_user";

const getUsers = () => {
  const users = localStorage.getItem(STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users: any[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

const saveCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Initialize with admin user if no users exist
const initializeUsers = () => {
  const users = getUsers();
  if (users.length === 0) {
    const adminUser = {
      id: "admin-id",
      email: "uchtamsingh@gmail.com",
      password: "@Aa0000Zz", // In a real app, this would be hashed
      username: "Uchtam",
      clientId: "01",
      isAdmin: true,
      zCoins: 1000000,
      phoneNumber: "+1234567890",
    };
    saveUsers([adminUser]);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize users if needed
    initializeUsers();

    // Check if user is logged in
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const signUp = async (data: {
    email: string;
    password: string;
    username: string;
    phoneNumber: string;
  }) => {
    try {
      const users = getUsers();

      // Check if email already exists
      if (users.some((u: any) => u.email === data.email)) {
        return { error: { message: "Email already in use" } };
      }

      // Generate client ID
      const lastClientId =
        users.length > 0
          ? Math.max(...users.map((u: any) => parseInt(u.clientId || "0")))
          : 1;
      const clientId = String(lastClientId + 1).padStart(2, "0");

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email: data.email,
        password: data.password, // In a real app, this would be hashed
        username: data.username,
        clientId,
        isAdmin: false,
        zCoins: 100000,
        phoneNumber: data.phoneNumber,
      };

      users.push(newUser);
      saveUsers(users);

      return { error: null };
    } catch (error) {
      console.error("Error during sign up:", error);
      return { error };
    }
  };

  const signIn = async (data: { email: string; password: string }) => {
    try {
      const users = getUsers();
      const user = users.find(
        (u: any) => u.email === data.email && u.password === data.password,
      );

      if (!user) {
        return { error: { message: "Invalid email or password" } };
      }

      // Create user object without password
      const { password, ...userWithoutPassword } = user;
      setUser(userWithoutPassword);
      saveCurrentUser(userWithoutPassword);

      return { error: null };
    } catch (error) {
      console.error("Error during sign in:", error);
      return { error };
    }
  };

  const signOut = async () => {
    setUser(null);
    saveCurrentUser(null);
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
