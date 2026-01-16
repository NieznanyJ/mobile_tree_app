import { StyleSheet, Text, View } from "react-native";

const CustomIcon = ({
  focused,
  title,
  icon,
  isOnline,
}: {
  focused: boolean;
  title: string;
  icon: React.ReactNode;
  isOnline: boolean;
}) => {
  if (focused) {
    return (
      <View
        className="flex flex-col items-center justify-center gap-1 mt-10  "
        style={{ minWidth: 44, minHeight: 44 }}
      >
        <View>{icon}</View>
        <Text
          className={`text-sm font-medium ${focused ? "text-white" : "text-gray-300"}`}
          style={{
            color: focused
              ? styles.iconColorFocused.color
              : styles.iconColor.color,
          }}
        >
          {title}
        </Text>
      </View>
    );
  }
  return (
    <View
      className="flex flex-col items-center justify-center gap-1 mt-10  "
      style={{ minWidth: 44, minHeight: 44 }}
    >
      <View>{icon}</View>
      <Text
        className={`text-sm font-medium ${focused ? "text-white" : "text-gray-300"}`}
        style={{
          color: focused
            ? styles.iconColorFocused.color
            : styles.iconColor.color,
        }}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconColorFocused: { color: "#00964a" },
  iconColor: { color: "#737373" },
});

export default CustomIcon;
