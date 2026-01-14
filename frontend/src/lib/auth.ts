import { User } from "@/types";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const setUser = (user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getUser = (): User | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const removeUser = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
};

export const clearAuth = (): void => {
  removeToken();
  removeUser();
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getUserRole = (): "FARMER" | "ADMIN" | null => {
  const user = getUser();
  return user?.role || null;
};
