import { FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { Tabs, useRouter, usePathname } from "expo-router";
import React, { useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import CustomIcon from "@/components/ui/icons/CustomIcon";
import WidgetsModal from "@/components/modals/WidgetsModal";
import InfoBanner from "@/components/ui/InfoBanner";
import { useAuth } from "@/lib/context/AuthContext";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const ICON_SIZE = 24;

const Header = ({
  isGuest,
  username,
  onPress,
  icon,
  pathname,
}: {
  isGuest: boolean;
  username: string;
  onPress: () => void;
  icon: React.ReactNode;
  pathname: string;
}) => {
  const [widgetsModalVisible, setWidgetsModalVisible] = useState(false);

  const isStartRoute = pathname === "/";
  return (
    <View className={`w-full p-2 pt-16 flex-row items-center  bg-background` + (isStartRoute ? " justify-between" : " justify-end")}>
      {pathname === "/" && (
        <Pressable className="bg-secondary p-2 rounded-full" onPress={() => setWidgetsModalVisible(true)} >
          <MaterialIcons name="widgets" size={24} color="#fff" />
        </Pressable>
      )}

      <Pressable onPress={() => onPress()}>{icon}</Pressable>

      <WidgetsModal
        visible={widgetsModalVisible}
        onClose={() => setWidgetsModalVisible(false)}
      />
    </View>
  );
};
const TabLayout = () => {
  const router = useRouter();
  const { user, isGuest, isOnline } = useAuth();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const username = user?.username || "Gościu";

  return (
    <>
      <InfoBanner />

      <Tabs
        screenOptions={{
          animation: "shift",
          header: () => (
            <Header
              isGuest={isGuest}
              username={username}
              onPress={() => router.push("/settings")}
              icon={
                <Ionicons name="settings-outline" size={28} color="#030712" />
              }
              pathname={pathname}
            />
          ),
          headerShown: true,
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#FFFFFF",
            shadowColor: "transparent",
          },
          tabBarShowLabel: false,
          tabBarStyle: {
            paddingHorizontal: 10,
            paddingBottom: (insets.bottom || 0) + 12,
            height: 72 + (insets.bottom || 0),
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          },
          tabBarItemStyle: {
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Index",
            tabBarIcon: ({ focused }) => (
              <CustomIcon
                isOnline={isOnline}
                focused={focused}
                title="Start"
                icon={
                  <Octicons
                    name={focused ? "home-fill" : "home"}
                    size={ICON_SIZE}
                    color={
                      focused
                        ? styles.iconColorFocused.color
                        : styles.iconColor.color
                    }
                  />
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            headerShown: false,
            title: "Camera",
            tabBarStyle: { display: "none" },
            tabBarIcon: ({ focused }) => (
              <View
                className={`size-[70px] rounded-full flex items-center justify-center border border-gray-200 ${focused ? "bg-secondary" : "bg-background"}`}
              >
                <Ionicons
                  name={focused ? "camera" : "camera-outline"}
                  size={32}
                  color={focused ? "#fff" : styles.iconColor.color}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            href: null,
            title: "Library",
            tabBarIcon: ({ focused }) => (
              <CustomIcon
                isOnline={isOnline}
                focused={focused}
                title="Atlas"
                icon={
                  <Ionicons
                    name="library-outline"
                    size={ICON_SIZE}
                    color={
                      focused
                        ? styles.iconColorFocused.color
                        : styles.iconColor.color
                    }
                  />
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: "/(tabs)/profile",
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <CustomIcon
                isOnline={isOnline}
                focused={focused}
                title="Profil"
                icon={
                  <FontAwesome5
                    name={focused ? "user-alt" : "user"}
                    size={ICON_SIZE}
                    color={
                      focused
                        ? styles.iconColorFocused.color
                        : styles.iconColor.color
                    }
                  />
                }
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabLayout;

const styles = StyleSheet.create({
  iconColorFocused: { color: "#00964a" },
  iconColor: { color: "#737373" },
});
