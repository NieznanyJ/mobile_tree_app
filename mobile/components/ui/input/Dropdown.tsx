import { useRef } from 'react';
import { Text,View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import { DropdownItem } from '@/app/settings';



interface DropdownProps {
  items: DropdownItem[];
  label: string;
  value: string | number;
  setValueChanged?: (value: boolean) => void
}


export const Dropdown = ({ items, label, value, setValueChanged }: DropdownProps) => {

  const previousValue = useRef(value);

  const handleChange = (newValue: any) => {
    const item = items.find(item => item.value === newValue);
    item?.onSelect();

    if (newValue !== previousValue.current) {
      setValueChanged?.(true);
      previousValue.current = newValue;
    }
  }

  return (
    <View className='w-full'>
      <Text>{label}</Text>
      <RNPickerSelect
        placeholder={{}}
        value={value}
        onValueChange={(newValue) => handleChange(newValue)}
        items={items.map(item => ({ label: item.label, value: item.value }))}
      />
    </View>
  );
};