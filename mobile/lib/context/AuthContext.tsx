import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

// --- TYPY DANYCH ---
export interface LoginData {
  username: string;
  password: string;
}
export interface RegisterData {
  email: string;
  username: string;
  password: string;
}
interface User {
  email: string;
  username: string;
}
export interface ApiError {
  field: "email" | "username" | "generic";
  message: string;
}
interface AuthContextType {
  login: (
    data: LoginData,
  ) => Promise<
    { success: true; data: any } | { success: false; error: ApiError }
  >;
  register: (
    data: RegisterData,
  ) => Promise<
    { success: true; data: any } | { success: false; error: ApiError }
  >;
  logout: () => void;
  enterAsGuest: () => void;
  user: User | null;
  token: string | null;
  isGuest: boolean;
  isLoading: boolean;
}

// --- STAŁE ---
const API_URL = "http://172.21.16.1:8008";
const TOKEN_KEY = "user-token";

// --- KONTEKST ---
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (storedToken) {
          setToken(storedToken);
          // TODO: Pobierz dane użytkownika na podstawie tokena
        }
      } catch (e) {
        console.error("Failed to load auth token:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const register = async (
    userData: RegisterData,
  ): Promise<
    { success: true; data: any } | { success: false; error: ApiError }
  > => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        const errorPayload: ApiError = {
          field: data.detail?.field || "generic",
          message: data.detail?.message || "Wystąpił błąd serwera.",
        };
        return { success: false, error: errorPayload };
      }
      return { success: true, data: data };
    } catch (e) {
      const networkError: ApiError = {
        field: "generic",
        message: "Nie można połączyć się z serwerem.",
      };
      return { success: false, error: networkError };
    }
  };

  const login = async (
    data: LoginData,
  ): Promise<
    { success: true; data: any } | { success: false; error: ApiError }
  > => {
    try {
      const formBody = `username=${encodeURIComponent(
        data.username,
      )}&password=${encodeURIComponent(data.password)}`;
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: formBody,
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Zwracamy obiekt błędu, zamiast rzucać wyjątkiem
        return {
          success: false,
          error: {
            field: "generic",
            message: responseData.detail || "Logowanie nie powiodło się",
          },
        };
      }

      const { access_token } = responseData;
      setToken(access_token);
      await SecureStore.setItemAsync(TOKEN_KEY, access_token);
      setIsGuest(false);
      setUser(responseData.user); // TODO: Uzupełnij email, jeśli jest dostępny

      router.replace("/(tabs)");
      return { success: true, data: responseData };
    } catch (e: any) {
      return {
        success: false,
        error: {
          field: "generic",
          message: e.message || "Wystąpił nieznany błąd",
        },
      };
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    setIsGuest(false);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    router.replace("/");
  };

  const enterAsGuest = () => {
    setIsGuest(true);
  };

  const value = {
    user,
    token,
    isGuest,
    isLoading,
    login,
    register,
    logout,
    enterAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
