import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

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
  id: number;
  email: string;
  username: string;
}

// Auth API Response Types
interface UserData {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserData;
}


export interface ApiError {
  field: "email" | "username" | "generic";
  message: string;
}
interface AuthContextType {
  login: (
    data: LoginData,
  ) => Promise<
    { success: true; data: LoginResponse } | { success: false; error: ApiError }
  >;
  register: (
    data: RegisterData,
  ) => Promise<
    { success: true; data: UserData } | { success: false; error: ApiError }
  >;
  logout: () => void;
  enterAsGuest: () => void;
  user: User | null;
  token: string | null;
  isGuest: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<
    | { ok: true }
    | { ok: false; unauthorized?: boolean; network?: boolean }
    | undefined
  >;
  isOnline: boolean;
}

// --- STAŁE ---
const API_URL = process.env.EXPO_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error("Missing EXPO_PUBLIC_API_URL environment variable");
}
const TOKEN_KEY = "user-token";
const GUEST_FLAG_KEY = "guest-flag";

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
  const [isOnline, setIsOnline] = useState(true);
  const wasOnline = useRef<boolean | null>(null);

  // Pobiera dane użytkownika na podstawie tokena
  const fetchUserData = async (accessToken: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setToken(null);
        setUser(null);
        setIsGuest(false);
        return { ok: false, unauthorized: true } as const;
      }

      if (!response.ok) {
        return { ok: false } as const;
      }

      const userData: UserData = await response.json();
      setUser({
        id: userData.id,
        email: userData.email,
        username: userData.username,
      });
      return { ok: true } as const;
    } catch {
      // Błąd sieci — zostaw token, spróbujemy ponownie później
      // Nie logujemy, żeby nie pokazywać toastów w Expo
      return { ok: false, network: true } as const;
    }
  };

  const refreshUser = useCallback(async () => {
    if (!token) return;
    return await fetchUserData(token);
  }, [token]);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (storedToken) {
          setToken(storedToken);
          const result = await fetchUserData(storedToken);
          if (result?.ok) {
            setIsLoading(false);
            return;
          }
        }
        // Jeśli brak tokena lub token nieważny, sprawdź czy był tryb gościa
        const guestFlag = await AsyncStorage.getItem(GUEST_FLAG_KEY);
        if (guestFlag === "true") {
          setIsGuest(true);
        }
      } catch (e) {
        console.error("Failed to load auth token:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  // Nasłuch stanu sieci
  useEffect(() => {
    const setInitial = async () => {
      const state = await NetInfo.fetch();
      const online = !!state.isConnected && state.isInternetReachable !== false;
      setIsOnline(online);
      wasOnline.current = online;
    };
    setInitial();

    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = !!state.isConnected && state.isInternetReachable !== false;
      setIsOnline(online);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Auto-refresh po powrocie sieci
  useEffect(() => {
    if (wasOnline.current === false && isOnline && token) {
      refreshUser();
    }
    wasOnline.current = isOnline;
  }, [isOnline, token, refreshUser]);

  const register = async (
    userData: RegisterData,
  ): Promise<
    { success: true; data: UserData } | { success: false; error: ApiError }
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
    } catch {
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
    { success: true; data: LoginResponse } | { success: false; error: ApiError }
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
      await AsyncStorage.setItem(GUEST_FLAG_KEY, "false");

      // Pobierz dane użytkownika
      await fetchUserData(access_token);

      router.replace("/(tabs)");
      return { success: true, data: responseData };
    } catch (e) {
      return {
        success: false,
        error: {
          field: "generic",
          message: e instanceof Error ? e.message : "Wystąpił nieznany błąd",
        },
      };
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    setIsGuest(false);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await AsyncStorage.setItem(GUEST_FLAG_KEY, "false");
    router.replace("/");
  };

  const enterAsGuest = () => {
    setIsGuest(true);
    setUser(null);
    setToken(null);
    SecureStore.deleteItemAsync(TOKEN_KEY);
    AsyncStorage.setItem(GUEST_FLAG_KEY, "true");
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
    refreshUser,
    isOnline,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
