import { Stack } from "expo-router";
import React from "react";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerTitle: "",
          headerShadowVisible: false,
          headerShown: true, // Upewniamy się, że nagłówek jest widoczny
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerTitle: "",
          headerShadowVisible: false,
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
