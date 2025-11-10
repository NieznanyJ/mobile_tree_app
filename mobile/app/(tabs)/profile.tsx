import React, { useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthForm from "@/components/forms/auth/AuthForm";
import Button from "@/components/ui/Button";
import { loginFormFields } from "@/constants/formFields";
import { useAuth } from "@/lib/context/AuthContext";

const ProfileScreen = () => {
  const { token, isGuest, logout } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);

  // TODO: add theme change later 
  // const { theme, toggleTheme } = useTheme();


  useEffect(() => {
    if (token) setModalVisible(false)
  }, [token])

  return (
    <SafeAreaView className="flex-1 bg-background p-4 ">
      <View className="flex-1 items-center justify-between gap-8">
        <Text className="text-2xl font-bold text-textPrimary">
          {token ? "Jesteś zalogowany" : "Jesteś w trybie gościa"}
        </Text>


        <View className="w-full items-center">
          {token ? (
            <Button
              title="Wyloguj"
              onPress={logout}
              className="w-full"
            />
          ) : isGuest ? (
            <Button
              title="Zaloguj się"
              onPress={() => setModalVisible(true)} // Otwieramy modal
              className="w-full"
            />
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



        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-11/12 bg-white p-6 rounded-lg shadow-lg">
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
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;
