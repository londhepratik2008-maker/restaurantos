"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { account } from "@/lib/appwrite";
import { Models, OAuthProvider } from "appwrite";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  async function clearSession() {
    try {
      const current = await account.get();
      if (current) {
        await account.deleteSession("current");
      }
    } catch {
      // no session, ignore
    }
  }

  async function login(email: string, password: string) {
    await clearSession();
    await account.createEmailPasswordSession(email, password);
    const currentUser = await account.get();
    setUser(currentUser);
  }

  async function signup(name: string, email: string, password: string) {
    await clearSession();
    await account.create("unique()", email, password, name);
    await account.createEmailPasswordSession(email, password);
    const currentUser = await account.get();
    setUser(currentUser);
  }

  async function loginWithGoogle() {
    await clearSession();
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/login`
    );
  }

  async function logout() {
    try {
      await account.deleteSession("current");
    } catch {
      // already logged out
    }
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
