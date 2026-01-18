import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  className?: string;
  textClassName?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
}

const Button = ({
  title,
  onPress,
  className,
  textClassName,
  isLoading,
  children,
  ...props
}: ButtonProps) => {
  const renderContent = (isLoading: boolean = false) => {
    if (isLoading) {
      return <ActivityIndicator size="small" color="#fff" />;
    }

    return (
      <Text
        className={`text-white text-center font-medium text-lg ${textClassName}`}
      >
        {title}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={isLoading || props.disabled}
      onPress={onPress}
      className={`w-2/3 text-center mt-5 px-4 py-4 bg-secondary rounded-full border-2 border-secondary ${className}`}
      {...props}
    >
      {renderContent(isLoading)}
      {children}
    </TouchableOpacity>
  );
};

export default Button;
