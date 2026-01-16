import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import Button from "@/components/ui/Button";
import SimpleInput from "@/components/ui/input/SimpleInput";
import { useAuth } from "@/lib/context/AuthContext";
import { LoginFormValues, loginSchema } from "@/lib/schemas/authSchema";

interface LoginFormProps {
  onLoginSuccess?: () => void;
  children?: React.ReactNode;
}

const LoginForm = ({ onLoginSuccess, children }: LoginFormProps) => {
  const { login, isLoading } = useAuth();
  // const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setApiError(null);

    const result = await login(data);

    if (result.success) {
      // Logowanie udane, wywołujemy callback (np. do zamknięcia modala)
      onLoginSuccess?.();
    } else {
      // Logowanie nieudane, ustawiamy komunikat błędu
      setApiError(result.error.message);
    }
  };

  return (
    <View className="w-full flex  items-center flex-col gap-4">
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <SimpleInput
            label="Nazwa użytkownika"
            placeholder="Wpisz swoją nazwę użytkownika"
            editable={isLoading}
            value={value}
            onChangeText={(text) => {
              setApiError(null);
              onChange(text);
            }}
            error={errors.username?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <SimpleInput
            label="Hasło"
            placeholder="Wpisz swoje hasło"
            editable={isLoading}
            value={value}
            onChangeText={(text) => {
              setApiError(null);
              onChange(text);
            }}
            type="password"
            error={errors.password?.message}
          />
        )}
      />

      {apiError && <Text className="text-red-600 text-center">{apiError}</Text>}

      <Button
        title="Zaloguj się"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />
      {children}
    </View>
  );
};

export default LoginForm;
