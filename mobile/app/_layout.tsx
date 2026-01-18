import "./globals.css";

import { useFonts } from "expo-font";
import { router, SplashScreen, Stack, useSegments } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { isPublicRoute } from "@/constants/routes";
import { AuthProvider, useAuth } from "@/lib/context/AuthContext";
import { ThemeProvider } from "@/lib/context/ThemeContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { token, isGuest, isLoading } = useAuth();
  const segments = useSegments();
  const { colorScheme } = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    // Czekamy na zakończenie ładowania (fontów i tokena)
    const isAppReady = !isLoading && (fontsLoaded || fontError);
    if (!isAppReady) {
      return;
    }

    const inApp = segments[0] === "(tabs)";
    const isPublic = isPublicRoute(segments[0]);

    if (token && !inApp) {
      // User logged in but outside main app
      if (!isPublic) {
        router.replace("/(tabs)");
      }
    } else if (!token && isGuest && !inApp) {
      // Guest but outside main app
      if (!isPublic) {
        router.replace("/(tabs)");
      }
    } else if (!token && !isGuest && inApp) {
      // Not logged in, not guest, but trying to enter app
      router.replace("/(auth)/login");
    }
  }, [token, isGuest, isLoading, fontsLoaded, fontError, segments]);

  // Jeśli aplikacja nie jest gotowa, pokazujemy spinner
  if (isLoading || (!fontsLoaded && !fontError)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider className={`font-sans ${colorScheme}`}>
      <ErrorBoundary>
        <StatusBar barStyle={"dark-content"} backgroundColor={'#5CE7A0'} />
        <Stack>
          {/* Ekran powitalny jest teraz ekranem głównym */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(media-browser)"
            options={{
              headerShown: false,
              headerTitle: "",
              headerTitleAlign: "center",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              headerShown: true,
              headerTitle: "Ustawienia",
              headerTitleAlign: "center",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="predict"
            options={{
              headerShown: true,
              headerTitle: "Sprawdź gatunek drzewa",
              headerTitleAlign: "center",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="history"
            options={{
              headerShown: true,
              headerTitle: "Historia przewidywań",
              headerTitleAlign: "center",
              headerShadowVisible: false,
            }}
          />
        </Stack>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
