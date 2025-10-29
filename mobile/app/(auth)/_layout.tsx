import { AntDesign } from "@expo/vector-icons"; // Importujemy ikonę strzałki
import { Stack, Tabs, useRouter } from "expo-router";
import { Pressable } from "react-native";

const AuthLayout = () => {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        tabBarStyle: { display: "none" },
        headerStyle: {
          backgroundColor: "#FFFFFF",
          shadowColor: "transparent",
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
    </Tabs>
  );
};

export default AuthLayout;
