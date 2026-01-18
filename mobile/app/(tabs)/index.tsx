import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MediaBrowser from "@/components/MediaBrowser";
import CarouselComponent from "@/components/ui/CarouselComponent";
import treeFactsPL from "@/constants/treeFactsPL";
import { useSettingsStore } from "@/lib/store/settingsStore";
import { useAuth } from "@/lib/context/AuthContext";
import CTA from "@/components/ui/CTA";

export default function Index() {
  const { enableTreeFacts, widgetsEnabled, activeWidgets } = useSettingsStore();
  const { user } = useAuth();
  const { treeFacts, ...others } = activeWidgets;
  const areAllWidgetsDisabled = Object.values(others).every(value => value === false);
  const shouldShowCTA = !widgetsEnabled || areAllWidgetsDisabled;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 8, paddingTop: 0 }}
      >
        {/* Welcome section */}
        <View className="px-4 pb-4 mb-4">
          <Text className="text-2xl font-bold text-secondary">
            Cześć {user?.username || "Gościu"}! 👋
          </Text>
          <Text className="text-sm text-gray-600 mt-2">
            Poznaj gatunki drzew i powiększ swoją wiedzę
          </Text>
        </View>

        {enableTreeFacts && widgetsEnabled && activeWidgets.treeFacts && (
          <View className="pb-8">
            <Text className="text-2xl font-semibold text-center mb-4 text-black">Ciekawostki o drzewach</Text>
            <CarouselComponent content={treeFactsPL} />
          </View>
        )}
        {shouldShowCTA && <CTA />}
        <MediaBrowser />

      </ScrollView>
    </SafeAreaView>
  );
}

