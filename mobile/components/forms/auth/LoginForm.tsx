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
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);

    try {
      const result = await login(data);

      if (result.success) {
        onLoginSuccess?.();
      } else {
        setApiError(result.error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="w-full flex items-center flex-col gap-4">
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <SimpleInput
            label="Nazwa użytkownika"
            placeholder="Wpisz swoją nazwę użytkownika"
            editable={!isSubmitting}
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
            editable={!isSubmitting}
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
        isLoading={isSubmitting}
      />
      {children}
    </View>
  );
};

export default LoginForm;
