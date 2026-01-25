import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, TextInput, View } from "react-native";

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
  return (
    <View className="flex-row items-center bg-gray-100 rounded-xl px-3 h-12">
      <Ionicons name="search" size={20} color="#9ca3af" />
      <TextInput
        className="flex-1 ml-2 text-textPrimary text-base"
        placeholderTextColor="#9ca3af"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
      {!!value && (
        <Pressable
          onPress={handleReset}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close-circle" size={20} color="#9ca3af" />
        </Pressable>
      )}
    </View>
  );
};

export default SearchInput;
