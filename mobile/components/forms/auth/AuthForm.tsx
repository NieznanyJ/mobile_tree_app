import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { z } from "zod";

import Button from "@/components/ui/Button";
import SimpleInput from "@/components/ui/input/SimpleInput";
import { FormFields } from "@/constants/formFields";
import { useAuth } from "@/lib/context/AuthContext";
import {
  LoginFormValues,
  loginSchema,
  RegisterFormValues,
  registerSchema,
} from "@/lib/schemas/authSchema";

type AuthFormProps = {
  formType: "login" | "register";
  formFields: FormFields;
  onSubmitSuccess?: () => void;
  children?: React.ReactNode;
};

const AuthForm = ({
  formType,
  formFields,
  onSubmitSuccess,
  children,
}: AuthFormProps) => {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<{
    [key: string]: string | undefined;
  }>({});

  const isLogin = formType === "login";
  const schema = isLogin ? loginSchema : registerSchema;
  type FormValues = z.infer<typeof schema>;

  const defaultValues = formFields.reduce(
    (acc, field) => {
      acc[field.id as keyof FormValues] = "" as any;
      return acc;
    },
    {} as Record<keyof FormValues, string>,
  );

  const {
    control,
    handleSubmit,
    formState: { errors: zodErrors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    setApiErrors({});

    const result = isLogin
      ? await login(data as LoginFormValues)
      : await register(data as RegisterFormValues);

    if (result.success) {
      onSubmitSuccess?.();
    } else {
      setApiErrors({ [result.error.field]: result.error.message });
      const newApiErrors = { [result.error.field]: result.error.message };
      setApiErrors(newApiErrors);
      console.log("AuthForm - API Errors set:", newApiErrors);
    }
    setIsLoading(false);
  };

  return (
    <View className="w-full flex items-center flex-col gap-4">
      {formFields.map((item) => (
        <Controller
          key={item.id}
          control={control}
          name={item.id as keyof FormValues}
          render={({ field: { onChange, value } }) => (
            <SimpleInput
              label={item.label}
              placeholder={item.placeholder}
              value={value}
              editable={!isLoading}
              onChangeText={(text) => {
                setApiErrors({});
                onChange(text);
              }}
              type={item.type}
              error={(zodErrors as any)[item.id]?.message || apiErrors[item.id]}
            />
          )}
        />
      ))}

      {apiErrors.generic && (
        <Text className="text-red-600 text-center">{apiErrors.generic}</Text>
      )}

      <Button
        title={isLogin ? "Zaloguj się" : "Załóż konto"}
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />
      {children}
    </View>
  );
};

export default AuthForm;
