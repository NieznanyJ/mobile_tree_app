import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const online = false;

const CustomIcon = ({
  focused,
  title,
  icon,
}: {
  focused: boolean;
  title: string;
  icon: React.ReactNode;
}) => {
  if (focused) {
    return (
      <View
        className={`min-h-[56px] w-full flex flex-row rounded-full mt-9 flex-1 items-center justify-center overflow-hidden gap-2 ${focused ? "bg-secondary" : "bg-transparent"} ${online ? "min-w-[100px]" : "min-w-[116px]"}`}
      >
        {icon}
        <Text
          className={`text-lg font-medium ${focused ? "text-white" : "text-gray-300"}`}
        >
          {title}
        </Text>
      </View>
    );
  }
  return (
    <View className="min-h-14 w-full flex flex-row  rounded-full mt-9 flex-1 items-center justify-center overflow-hidden gap-2 ">
      {icon}
    </View>
  );
};

const TabLayout = () => {
  const router = useRouter();
  const iconSize = 20;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarShowLabel: false,
        headerTitle: "",
        headerStyle: {
          backgroundColor: "#FFFFFF",
          shadowColor: "transparent",
        },
        headerRight: () => (
          <Pressable onPress={() => router.push("/profile")}>
            <Ionicons
              name="settings-outline"
              size={28}
              color="#030712"
              style={{ marginRight: 15 }}
            />
          </Pressable>
        ),
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderRadius: 50,
          marginHorizontal: 16,
          paddingHorizontal: 20,
          marginBottom: 40,
          position: "absolute",
          bottom: 30,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 1,
          height: 70,
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
              focused={focused}
              title="Start"
              icon={
                <Feather
                  name="home"
                  size={iconSize}
                  color={focused ? "#FFFFFF" : "#737373"}
                />
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          tabBarIcon: ({ focused }) => (
            <CustomIcon
              focused={focused}
              title="Aparat"
              icon={
                <Feather
                  name="camera"
                  size={iconSize}
                  color={focused ? "#FFFFFF" : "#737373"}
                />
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ focused }) => (
            <CustomIcon
              focused={focused}
              title="Historia"
              icon={
                <Octicons
                  name="history"
                  size={iconSize}
                  color={focused ? "#FFFFFF" : "#737373"}
                />
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          href: online ? { pathname: "/(tabs)/library" } : null,
          title: "Library",
          tabBarIcon: ({ focused }) => (
            <CustomIcon
              focused={focused}
              title="Atlas"
              icon={
                <Ionicons
                  name="library-outline"
                  size={iconSize}
                  color={focused ? "#FFFFFF" : "#737373"}
                />
              }
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
