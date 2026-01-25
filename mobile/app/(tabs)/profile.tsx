import React, { useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import AuthForm from "@/components/forms/auth/AuthForm";
import Button from "@/components/ui/Button";
import { UserInfo } from "@/components/ui/UserInfo";
import { loginFormFields } from "@/constants/formFields";
import { useAuth } from "@/lib/context/AuthContext";
import { Link, router } from "expo-router";

const ProfileScreen = () => {
  const { token, isGuest, logout, user } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);

  // TODO: add theme change later
  // const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (token) setModalVisible(false);
  }, [token]);


  return (
    <SafeAreaView className="flex-1 bg-background p-4  ">
      <View className="flex-1 items-center justify-between gap-8 ">
        <View className="w-full items-center gap-6">
          <Text className="text-2xl font-bold text-textPrimary">
            {token ? "Profil użytkownika" : "Jesteś w trybie gościa"}
          </Text>

          {token && user && <UserInfo user={user} />}

          {token && (
            <Pressable
              onPress={() => router.push("/history")}
              className="w-full bg-background rounded-lg p-4 shadow-sm flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="history" size={24} color="#16a34a" />
                <View>
                  <Text className="text-lg font-semibold text-textPrimary">
                    Historia przewidywań
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    Zobacz wszystkie rozpoznane drzewa
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </Pressable>
          )}
        </View>

        <View className="w-full items-center">
          {token ? (
            <Button title="Wyloguj" onPress={logout} className="w-full" />
          ) : isGuest ? (
            <View className="w-full flex flex-col gap-4">
              <Button
                title="Zaloguj się"
                onPress={() => setModalVisible(true)} // Otwieramy modal
                className="w-full"
              />
              <Text className=" text-xl text-textPrimary text-center">
                Nie masz konta?{" "}
                <Link href="/register" className="text-secondary font-bold">
                  Zarejestruj się
                </Link>
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      {/* --- LOGIN MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 w-full justify-center items-center bg-black/50"
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="w-11/12"
          >
            <View className="w-full bg-white p-6 rounded-lg shadow-lg">
              <Text className="text-2xl font-bold text-secondary text-center mb-6">
                Zaloguj się
              </Text>
              <AuthForm formType="login" formFields={loginFormFields}>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  className="mt-4"
                >
                  <Text className="text-center text-gray-500">Anuluj</Text>
                </Pressable>
              </AuthForm>
            </View>
          </Pressable>
        </Pressable>
      </Modal >
    </SafeAreaView >
  );
};

export default ProfileScreen;
