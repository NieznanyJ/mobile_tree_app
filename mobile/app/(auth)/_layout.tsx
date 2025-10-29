import { AntDesign } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

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
          <Pressable onPress={() => router.push("/")}>
            <AntDesign
              style={{ marginLeft: 15 }}
              name="arrow-left"
              size={28}
              color="black"
            />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
};

export default AuthLayout;
