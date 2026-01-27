/**
 * Kolory aplikacji - zsynchronizowane z tailwind.config.js
 * Używaj tych stałych w miejscach gdzie Tailwind nie działa
 * (StyleSheet, props komponentów, ikony itp.)
 */

export const colors = {
  // Główne kolory marki
  primary: "#5CE7A0",
  secondary: "#00964A",
  accent: "#05DF72",

  // Tła
  background: {
    light: "#FFFFFF",
    dark: "#030712",
  },

  // Tekst
  text: {
    primary: {
      light: "#030712",
      dark: "#FFFFFF",
    },
    gray: "#737373",
    muted: "#9ca3af",
  },

  // Stany
  error: "#dc2626",
  success: "#16a34a",
  warning: "#f59e0b",

  // Szarości (z Tailwind)
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
} as const;

// Aliasy dla wygody
export const primaryColor = colors.primary;
export const secondaryColor = colors.secondary;
export const accentColor = colors.accent;

export default colors;
