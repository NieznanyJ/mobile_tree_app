import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import AuthForm from "@/components/forms/auth/AuthForm";
import Button from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/input/Dropdown";
import { loginFormFields } from "@/constants/formFields";
import { useAuth } from "@/lib/context/AuthContext";
import { useSettingsStore } from "@/lib/store/settingsStore";
import CustomSwitch from "@/components/ui/CustomSwitch";
import TestErrorButtonDev from "@/components/TestErrorButtonDev";

export type DropdownItem = {
  label: string;
  value: string;
  onSelect: () => void;
};

interface Settings {
  albumsPerPage: number;
  displayOption: string;
  enableAlbumGrid: boolean;
  enableTreeFacts: boolean;
}

const ProfileScreen = () => {
  const { albumsPerPage, setAlbumsPerPage, displayOption, setDisplayOption, enableAlbumGrid, setEnableAlbumGrid, enableTreeFacts, setEnableTreeFacts, widgetsEnabled, setWidgetsEnabled, activeWidgets, toggleWidget } =
    useSettingsStore();
  const { token } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [valueChanged, setValueChanged] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    albumsPerPage: 4,
    displayOption: "grid",
    enableAlbumGrid: true,
    enableTreeFacts: true,
  });

  const dropdownOptions: DropdownItem[] = [
    {
      label: "2",
      value: "2",
      onSelect: () => setSettings((prev) => ({ ...prev, albumsPerPage: 2 })),
    },
    {
      label: "4",
      value: "4",
      onSelect: () => setSettings((prev) => ({ ...prev, albumsPerPage: 4 })),
    },
    {
      label: "6",
      value: "6",
      onSelect: () => setSettings((prev) => ({ ...prev, albumsPerPage: 6 })),
    },
    {
      label: "8",
      value: "8",
      onSelect: () => setSettings((prev) => ({ ...prev, albumsPerPage: 8 })),
    },
    {
      label: "10",
      value: "10",
      onSelect: () => setSettings((prev) => ({ ...prev, albumsPerPage: 10 })),
    },
  ];

  const displayOptions: DropdownItem[] = [
    {
      label: "Lista",
      value: "list",
      onSelect: () =>
        setSettings((prev) => ({ ...prev, displayOption: "list" })),
    },
    {
      label: "Siatka",
      value: "grid",
      onSelect: () =>
        setSettings((prev) => ({ ...prev, displayOption: "grid" })),
    },
  ];


  const handleResetSettings = () => {
    setAlbumsPerPage(4);
    setDisplayOption("grid");
    setEnableAlbumGrid(true);
    toggleWidget('treeFacts');
    setTimeout(() => {
      setValueChanged(false);
    }, 0);
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-4 ">
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View className="flex-1 items-center justify-start gap-8">

          <View className="w-full flex-1 flex-col justify-between">
            <View className="flex flex-col w-full gap-4 items-center">

              <View className="w-full border-b-[1px] border-gray-600 py-2">
                <Text className="text-lg font-semibold mb-4"> Ustawienia wyświetlania </Text>
                <View className="flex flex-col w-full gap-4 mt-4">
                  <Dropdown
                    items={dropdownOptions}
                    value={albumsPerPage}
                    label="Foldery na stronę"
                    onChange={(value) => setAlbumsPerPage(parseInt(value as string))}
                  />
                  <Dropdown
                    items={displayOptions}
                    value={displayOption}
                    label="Opcja wyświetlania folderów"
                    onChange={(value) => setDisplayOption(value as "list" | "grid")}
                  />
                </View>
              </View>

              <View className="w-full border-b-[1px] border-gray-600 py-2 pb-8">
                <Text className="text-lg font-semibold mb-2"> Widgety </Text>
                <View className="flex flex-col w-full gap-4 mt-4">
                  <View className="flex flex-row justify-between items-center w-full p-2">
                    <Text>Ostatnie zdjęcia</Text>
                    <CustomSwitch widgetId="recentPhotos" />
                  </View>
                  <View className="flex flex-row justify-between items-center w-full p-2">
                    <Text>Podgląd folderów</Text>
                    <CustomSwitch widgetId="albums" />
                  </View>
                  <View className="flex flex-row justify-between items-center w-full p-2">
                    <Text>Włącz fakty o drzewach</Text>
                    <CustomSwitch widgetId="treeFacts" />
                  </View>
                </View>
              </View>

            </View>
            <View className="w-full">
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
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

export default ProfileScreen;
