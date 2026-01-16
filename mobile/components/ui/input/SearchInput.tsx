import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  handleReset?: () => void;
}

const SearchInput = ({
  placeholder = "Search",
  value,
  onChangeText,
  handleReset,
}: SearchInputProps) => {
  const renderIcon = (value: string | undefined) => {
    if (!value)
      return (
        <Feather
          style={{ position: "absolute", right: 16, top: 10 }}
          name="search"
          size={20}
          color="black"
        />
      );
    return (
      <Pressable
        onPress={handleReset}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{ position: "absolute", right: 16, top: 12, zIndex: 10 }}
      >
        <Feather name="x" size={20} color="black" />
      </Pressable>
    );
  };

  return (
    <View className="relative">
      <TextInput
        className="border border-gray-300 w-full rounded-full p-2 pl-4 pr-10 h-12 text-textPrimary bg-background"
        placeholderTextColor={"#9ca3af"}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
      {renderIcon(value)}
    </View>
  );
};

export default SearchInput;
