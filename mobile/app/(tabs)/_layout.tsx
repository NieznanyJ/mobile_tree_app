import { FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { Tabs, usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Header from "@/components/ui/Header";
import CustomIcon from "@/components/ui/icons/CustomIcon";
import InfoBanner from "@/components/ui/InfoBanner";
import { ICON_SIZE } from "@/constants/components";
import { useAuth } from "@/lib/context/AuthContext";


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
                    name="home-fill"
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
          name="gallery"
          options={{
            headerShown: true,
            title: "Gallery",
            tabBarIcon: ({ focused }) => (
              <CustomIcon
                isOnline={isOnline}
                focused={focused}
                title="Galeria"
                icon={
                  <Ionicons
                    name="images"
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
          name="predict"
          options={{
            href: '/(tabs)/predict',
            headerShown: true,
            title: "Identyfikuj",
            tabBarIcon: ({ focused }) => (
              <CustomIcon
                isOnline={isOnline}
                focused={focused}
                title="Identyfikuj"
                icon={
                  <Ionicons
                    name="camera"
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
          name="atlas"
          options={{
            href: '/(tabs)/atlas',
            title: "Atlas",
            tabBarIcon: ({ focused }) => (
              <CustomIcon
                isOnline={isOnline}
                focused={focused}
                title="Atlas"
                icon={
                  <Ionicons
                    name="book"
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
                    name="user-alt"
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
