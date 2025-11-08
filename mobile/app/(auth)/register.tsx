import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";
import SimpleInput from "@/components/ui/input/SimpleInput";
import { RegisterFormValues, registerSchema } from "@/lib/schemas/authSchema";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // Registration logic here
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    {
      id: "username",
      type: "text",
      label: "Nazwa użytkownika",
      placeholder: "Nazwa użytkownika",
    },
    {
      id: "email",
      type: "emailAddress",
      label: "Email",
      placeholder: "email@example.com",
    },
    {
      id: "password",
      type: "password",
      label: "Hasło",
      placeholder: "Hasło",
    },
    {
      id: "confirmPassword",
      type: "password",
      label: "Potwierdź hasło",
      placeholder: "Potwierdź hasło",
    },
  ];

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

            <View className="w-full flex flex-col gap-2">
              {formFields.map((item) => (
                <Controller
                  key={item.id}
                  control={control}
                  name={item.id as keyof RegisterFormValues}
                  render={({ field: { onChange, value } }) => (
                    <SimpleInput
                      label={item.label}
                      placeholder={item.placeholder}
                      value={value}
                      onChangeText={onChange}
                      type={item.type}
                      error={errors[item.id as keyof RegisterFormValues]?.message}
                    />
                  )}
                />
              ))}
            </View>

            <View className="w-full flex-col items-center justify-between gap-8">
              <Button
                title="Załóż konto"
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
              />
              <Text className=" text-xl text-textPrimary text-center">
                Masz już konto?{" "}
                <Link href="/login" className="text-secondary font-bold">
                  Zaloguj się
                </Link>
              </Text>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView >
    </SafeAreaView >
  );
};

export default Register;