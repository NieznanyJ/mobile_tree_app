import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

import { colors } from "@/constants/colors";

type ButtonVariant = "primary" | "outline";

interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  className?: string;
  textClassName?: string;
  isLoading?: boolean;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: "bg-secondary border-secondary",
    text: "text-white",
  },
  outline: {
    container: "bg-transparent border-secondary",
    text: "text-secondary",
  },
};

const Button = ({
  title,
  onPress,
  className,
  textClassName,
  isLoading,
  variant = "primary",
  icon,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  const styles = variantStyles[variant];
  const isDisabled = isLoading || disabled;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={isDisabled}
      onPress={onPress}
      className={`w-2/3 px-4 py-4 rounded-full border-2 ${styles.container} ${isDisabled ? "opacity-50" : ""} ${className ?? ""}`}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={variant === "primary" ? "#fff" : colors.secondary} />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {icon || children}
          {title && (
            <Text className={`text-center font-medium text-lg ${styles.text} ${textClassName ?? ""}`}>
              {title}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
