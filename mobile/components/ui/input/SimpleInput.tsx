import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
  type?: string;
  label?: string;
  error?: string;
  className?: string;
  setError?: (error: string) => void;
}

const InputIcon = ({
  onPress,
  showPassword = false,
}: {
  onPress: () => void;
  showPassword?: boolean;
}) => {
  const iconName = !showPassword ? "eye" : "eye-invisible";
  return (
    <Pressable className="absolute bottom-11 right-0" onPress={onPress}>
      <AntDesign
        style={{ marginLeft: 15 }}
        name={iconName as any}
        size={24}
        color="#d1d5db"
      />
    </Pressable>
  );
};

const SimpleInput = ({
  placeholder,
  value,
  onChangeText,
  label,
  className,
  type = "default",
  error,
  setError,
  editable = true,
}: InputProps) => {
  const onChange = (value: string) => {
    onChangeText(value);
    setError?.("");
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const keyboardType =
    type === "emailAddress"
      ? "email-address"
      : type === "numeric"
        ? "numeric"
        : "default";
  const secureTextEntry = type === "password" && !showPassword;

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <View className="w-full flex flex-col gap-3">
      {label && <Text className="text-gray-600 ">{label}</Text>}
      <TextInput
        editable={editable ? true : false}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        className={`form-input border-b-2 text-xl text-black  ${className}`}
        placeholder={placeholder}
        placeholderTextColor={"#9ca3af"}
        value={value}
        onChangeText={onChange}
        style={{ borderColor: error ? "#dc2626" : "#d1d5db" }}
      />
      {type === "password" && (
        <InputIcon showPassword={showPassword} onPress={handleShowPassword} />
      )}

      <View className="h-5 ">
        {error && (
          <Text className="text-red-500 text-sm" style={{ color: "#dc2626" }}>
            {error}
          </Text>
        )}
      </View>
    </View>
  );
};

export default SimpleInput;
