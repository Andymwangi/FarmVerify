"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, RegisterInput, LoginInput } from "@/types";
import { authApi } from "@/lib/services";
import {
  setToken,
  getToken,
  setUser,
  getUser,
  clearAuth,
} from "@/lib/auth";

export const useAuth = () => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const savedUser = getUser();
    if (token && savedUser) {
      setUserState(savedUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (data: LoginInput) => {
    const response = await authApi.login(data);
    if (response.success && response.data) {
      setToken(response.data.token);
      setUser(response.data.user);
      setUserState(response.data.user);

      if (response.data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/farmer");
      }
      return response;
    }
    throw new Error(response.error || "Login failed");
  }, [router]);

  const register = useCallback(async (data: RegisterInput) => {
    const response = await authApi.register(data);
    if (response.success && response.data) {
      setToken(response.data.token);
      setUser(response.data.user);
      setUserState(response.data.user);
      router.push("/farmer");
      return response;
    }
    throw new Error(response.error || "Registration failed");
  }, [router]);

  const logout = useCallback(() => {
    clearAuth();
    setUserState(null);
    router.push("/login");
  }, [router]);

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    isFarmer: user?.role === "FARMER",
  };
};
