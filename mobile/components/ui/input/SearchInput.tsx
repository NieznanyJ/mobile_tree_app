import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, TextInput, View } from "react-native";

interface SearchInputProps {
  showDisplayButton?: boolean;
  placeholder?: string;
  value?: string;
  displayOption?: string;
  onChangeText?: (text: string) => void;
  handleReset?: () => void;
  onPress?: (displayOption: string) => void;
}

const SearchInput = ({
  showDisplayButton = true,
  placeholder = "Search",
  value,
  onChangeText,
  handleReset,
  onPress,
  displayOption
}: SearchInputProps) => {
  return (
    <View className="flex flex-row items-center w-full gap-2">
      <View className="flex-row items-center bg-gray-100 rounded-xl px-3 h-12 flex-1">
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

      {showDisplayButton &&
        <View className="flex-row items-center justify-end">
          <Pressable
            className="bg-gray-100 rounded-xl p-2"
            onPress={() => onPress?.(displayOption === "grid" ? "list" : "grid")}
          >
            <Ionicons
              name={displayOption === "grid" ? "list" : "grid"}
              size={24}
              color="#00964a"
            />
          </Pressable>
        </View>
      }

    </View>
  );
};

export default SearchInput;
