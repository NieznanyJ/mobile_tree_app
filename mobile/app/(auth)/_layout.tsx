import { Stack, useRouter } from "expo-router";
import { View } from "react-native";

import GoBackButton from "@/components/ui/GoBackButton";

const AuthLayout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerLeft: () => (
          <View style={{ marginLeft: 10 }}>
            <GoBackButton onPress={() => router.back()} />
          </View>
        ),
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
};

export default AuthLayout;
