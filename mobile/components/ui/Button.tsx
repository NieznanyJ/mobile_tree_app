import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  className?: string;
  textClassName?: string;
}

const Button = ({
  title,
  onPress,
  className,
  textClassName,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-2/3 text-center mt-5 px-4 py-4 bg-secondary rounded-full border-2 border-secondary ${className}`}
      {...props}
    >
      <Text
        className={`text-xl text-background font-medium text-center ${textClassName}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
