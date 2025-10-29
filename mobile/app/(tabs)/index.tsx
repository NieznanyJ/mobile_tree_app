import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-background">
      <Text className="text-3xl font-bold text-background">
        Edit app/index.tsx to edit this screen.
      </Text>
    </SafeAreaView>
  );
}
