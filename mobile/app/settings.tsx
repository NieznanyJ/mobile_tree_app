import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TestErrorButtonDev from "@/components/TestErrorButtonDev";
import CustomSwitch from "@/components/ui/CustomSwitch";
import { Dropdown } from "@/components/ui/input/Dropdown";
import { displayOptions, dropdownOptions } from "@/constants/settings";
import { useSettingsStore } from "@/lib/store/settingsStore";


const ProfileScreen = () => {
  const { albumsPerPage, setAlbumsPerPage, displayOption, setDisplayOption, setEnableAlbumGrid, toggleWidget } =
    useSettingsStore();



  const handleResetSettings = () => {
    Alert.alert(
      "Przywrócić ustawienia domyślne?",
      "Ta akcja nie może być cofnięta.",
      [
        {
          text: "Anuluj",
          onPress: () => { },
          style: "cancel",
        },
        {
          text: "Przywróć",
          onPress: () => {
            setAlbumsPerPage(4);
            setDisplayOption("grid");
            setEnableAlbumGrid(true);
            toggleWidget('treeFacts');
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-4 ">
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col justify-between gap-8 min-h-full">

          <View className="flex-col gap-4">
            <View className="flex flex-col w-full gap-4 items-center">

              <View className="w-full border-b-[1px] border-gray-600 py-2">
                <Text className="text-lg font-semibold mb-1">Widok galerii</Text>
                <Text className="text-xs text-gray-500 mb-4">Dostosuj sposób wyświetlania swoich zdjęć</Text>
                <View className="flex flex-col w-full gap-4 mt-4">
                  <Dropdown
                    items={dropdownOptions}
                    value={albumsPerPage}
                    label="Foldery na ekran"
                    onChange={(value) => setAlbumsPerPage(parseInt(value as string))}
                  />
                  <Dropdown
                    items={displayOptions}
                    value={displayOption}
                    label="Układ wyświetlania"
                    onChange={(value) => setDisplayOption(value as "list" | "grid")}
                  />
                </View>
              </View>

              <View className="w-full border-b-[1px] border-gray-600 py-2 pb-8">
                <Text className="text-lg font-semibold mb-1">Widgety ekranu głównego</Text>
                <Text className="text-xs text-gray-500 mb-4">Wybierz co chcesz widzieć na stronie głównej</Text>
                <View className="flex flex-col w-full gap-4 mt-4">
                  <View className="flex flex-row justify-between items-center w-full p-2">
                    <View>
                      <Text className="font-semibold">Ciekawostki</Text>
                      <Text className="text-xs text-gray-600">Poznaj fakty o drzewach</Text>
                    </View>
                    <CustomSwitch widgetId="treeFacts" />
                  </View>
                </View>
              </View>

            </View>

            <View className="w-full mt-8">
              <TouchableOpacity
                onPress={handleResetSettings}
                activeOpacity={0.7}
                className="py-2"
              >
                <Text className="text-center text-gray-500">Przywróć ustawienia domyślne</Text>
              </TouchableOpacity>

              {/* Dev Test Error Boundary Button */}
              {__DEV__ && (<TestErrorButtonDev />)}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default ProfileScreen;
