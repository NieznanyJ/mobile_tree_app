import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import { useEffect } from "react";
import { Linking, ScrollView, Text, View } from "react-native";

import MediaBrowser from "@/components/MediaBrowser";
import CarouselComponent from "@/components/ui/CarouselComponent";
import CTA from "@/components/ui/CTA";
import treeFactsPL from "@/constants/treeFactsPL";
import { useAuth } from "@/lib/context/AuthContext";
import { useSettingsStore } from "@/lib/store/settingsStore";

export default function Index() {
  const { enableTreeFacts, widgetsEnabled, activeWidgets } = useSettingsStore();
  const { user } = useAuth();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    if (permissionResponse && permissionResponse.status === "undetermined") {
      requestPermission();
    }
  }, [permissionResponse]);

  const handleRequestPermission = async () => {
    if (permissionResponse?.canAskAgain === false) {
      Linking.openSettings();
      return;
    }
    await requestPermission();
  };

  const welcomeMessage = {
    guest: {
      title: "Jesteś w trybie gościa",
      info: `Niektóre funkcje mogą być ograniczone w trybie gościa `,
    },
    user: {
      title: `Cześć ${user?.username}!`,
      info: "Poznaj gatunki drzew i powiększ swoją wiedzę",
    },
  };

  const createTreeFactsElements = (facts: string[]) => {
    return facts.map((fact, index) => (
      <View
        key={index}
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 8,
        }}
      >
        <Text className="text-center text-lg  ">
          {facts[index]}
        </Text>
      </View>
    ));
  }

  return (
    <View className="flex-1 p-2 bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 8, paddingTop: 0 }}
      >
        {/* 
          Niepotrzbne widgety        
        */}


        {/* <MediaBrowser
          permissionResponse={permissionResponse}
          requestPermission={handleRequestPermission}
          /> */}
          <View className=" pb-4 mb-4">
            <Text className="text-2xl font-bold text-secondary">{user?.username ? welcomeMessage.user.title : welcomeMessage.guest.title}</Text>
            <Text className="text-sm text-gray-600 mt-2">
              {user?.username ? welcomeMessage.user.info : welcomeMessage.guest.info} {!user?.username && <Text className="underline" onPress={() => router.push('/guest-info')}>Dowiedz się więcej</Text>}
            </Text>
          </View>
          {enableTreeFacts && widgetsEnabled && activeWidgets.treeFacts && (
            <View className="pb-8 mt-4">
              <Text className="text-2xl font-semibold text-center mb-4 text-black">Ciekawostki</Text>
              <CarouselComponent content={createTreeFactsElements(treeFactsPL)} />
            </View>
          )}

          <CTA />
      </ScrollView>
    </View>
  );
}

