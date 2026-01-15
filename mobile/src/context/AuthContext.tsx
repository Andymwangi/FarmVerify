import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { User, LoginInput, RegisterInput } from "../types";
import { authApi } from "../lib/services";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isFarmer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const userData = await SecureStore.getItemAsync("user");
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginInput) => {
    const response = await authApi.login(data);
    if (response.success && response.data) {
      await SecureStore.setItemAsync("token", response.data.token);
      await SecureStore.setItemAsync("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
    } else {
      throw new Error(response.error || "Login failed");
    }
  };

  const register = async (data: RegisterInput) => {
    const response = await authApi.register(data);
    if (response.success && response.data) {
      await SecureStore.setItemAsync("token", response.data.token);
      await SecureStore.setItemAsync("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
    } else {
      throw new Error(response.error || "Registration failed");
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        isFarmer: user?.role === "FARMER",
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
