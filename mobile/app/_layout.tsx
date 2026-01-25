import "./globals.css";

import { useFonts } from "expo-font";
import { router, SplashScreen, Stack, useSegments } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AnimatedSplashScreen from "@/components/AnimatedSplashScreen";
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
  const [isSplashTimeOver, setIsSplashTimeOver] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
  });

  // Używamy timera, aby zapewnić minimalny czas wyświetlania splash screena.
  // To pomaga zapobiec problemom z timingiem (race conditions) przy zimnym starcie.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashTimeOver(true);
    }, 3000); // Pokaż splash screen przez 3 sekundy

    return () => clearTimeout(timer);
  }, []);

  const isAppReady = !isLoading && (fontsLoaded || fontError);

  // Ukryj natywny splash screen tylko, gdy aplikacja jest gotowa i czas minął.
  useEffect(() => {
    if (isAppReady && isSplashTimeOver) {
      SplashScreen.hideAsync();
    }
  }, [isAppReady, isSplashTimeOver]);

  // Logika routingu (pozostaje bez zmian).
  useEffect(() => {
    if (!isAppReady) {
      return;
    }

    const inApp = segments[0] === "(tabs)";
    const isPublic = isPublicRoute(segments[0]);

    if (token && !inApp) {
      if (!isPublic) {
        router.replace("/(tabs)");
      }
    } else if (!token && isGuest && !inApp) {
      if (!isPublic) {
        router.replace("/(tabs)");
      }
    } else if (!token && !isGuest && inApp) {
      router.replace("/(auth)/login");
    }
  }, [token, isGuest, isAppReady, segments]);

  // Pokaż animowany splash, dopóki aplikacja nie jest gotowa LUB nie minął czas.
  if (!isAppReady || !isSplashTimeOver) {
    // Usunęliśmy onAnimationFinish na potrzeby tego testu
    return <AnimatedSplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
          <Stack.Screen
            name="tree/[id]"
            options={{
              headerShown: true,
              headerTitle: "",
              headerTitleAlign: "center",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="guest-info"
            options={{
              headerShown: true,
              headerTitle: "Tryb gościa",
              headerTitleAlign: "center",
              headerShadowVisible: false,
            }}
          />
        </Stack>
      </ErrorBoundary>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
