import { useRef } from "react";
import { Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";

import { DropdownItem } from "@/app/settings";

interface DropdownProps {
  items: DropdownItem[];
  label: string;
  value: string | number;
  onChange?: (value: string | number) => void;
}

export const Dropdown = ({
  items,
  label,
  value,
  onChange,
}: DropdownProps) => {
  const previousValue = useRef(value);

  const handleChange = (newValue: string | number) => {
    const item = items.find((item) => item.value === newValue);
    item?.onSelect();

    if (newValue !== previousValue.current) {
      previousValue.current = newValue;
      onChange?.(newValue);
    }
  };

  return (
    <View className="w-full px-2">
      <Text>{label}</Text>
      <RNPickerSelect
        placeholder={{}}
        value={value}
        onValueChange={(newValue) => handleChange(newValue)}
        items={items.map((item) => ({ label: item.label, value: item.value }))}
        style={{
          inputAndroid: {
            fontSize: 16,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1, // Szerokość obramowania
            borderColor: "gray", // Kolor obramowania
            borderRadius: 8, // Zaokrąglenie rogów
            color: "black",
            paddingRight: 30, // Miejsce na ikonkę
          },
        }}
      />
    </View>
  );
};
