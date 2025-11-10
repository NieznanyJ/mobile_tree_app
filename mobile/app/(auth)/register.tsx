import { Link, router } from "expo-router";
import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthForm from "@/components/forms/auth/AuthForm";
import { registerFormFields } from "@/constants/formFields";

const Register = () => {


  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
            padding: 16,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full p-4 flex items-center gap-10 justify-center ">
            <Text className="text-3xl font-bold text-secondary text-center ">
              Załóż konto i odkryj pełne możliwości aplikacji
            </Text>

            <AuthForm
              formType="register"
              formFields={registerFormFields}
              onSubmitSuccess={() => {
                Alert.alert(
                  "Rejestracja pomyślna!",
                  "Możesz się teraz zalogować.",
                  [{ text: "OK", onPress: () => router.push("/login") }]
                );
              }}
            >
              <Text className=" text-xl text-textPrimary text-center">
                Masz już konto?{" "}
                <Link href="/login" className="text-secondary font-bold">
                  Zaloguj się
                </Link>
              </Text>
            </AuthForm>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
