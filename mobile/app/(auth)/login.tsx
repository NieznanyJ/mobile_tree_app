import { Link } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthForm from "@/components/forms/auth/AuthForm";
import { loginFormFields } from "@/constants/formFields";

const LoginScreen = () => {

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 16,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full p-4 flex items-center gap-10 justify-center ">
            <Text className="text-3xl font-bold text-secondary text-center ">
              Witaj ponownie!
            </Text>

            {/* Używamy naszego nowego, reużywalnego komponentu */}

            <AuthForm formType="login" formFields={loginFormFields}>
              <Text className=" text-xl text-textPrimary text-center">
                Nie masz konta?{" "}
                <Link href="/register" className="text-secondary font-bold">
                  Zarejestruj się
                </Link>
              </Text>
            </AuthForm>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
