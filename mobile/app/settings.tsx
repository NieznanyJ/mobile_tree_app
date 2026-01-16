import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthForm from "@/components/forms/auth/AuthForm";
import Button from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/input/Dropdown";
import { loginFormFields } from "@/constants/formFields";
import { useAuth } from "@/lib/context/AuthContext";
import { useSettingsStore } from "@/lib/store/settingsStore";

export type DropdownItem = {
  label: string;
  value: string;
  onSelect: () => void;
};

interface Settings {
  albumsPerPage: number;
  displayOption: string;
}

const ProfileScreen = () => {
  const { albumsPerPage, setAlbumsPerPage, displayOption, setDisplayOption } =
    useSettingsStore();
  const { token } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [valueChanged, setValueChanged] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    albumsPerPage: 4,
    displayOption: "grid",
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

  const handleSaveSettings = () => {
    setIsLoading(true);
    try {
      setAlbumsPerPage(settings.albumsPerPage);
      setDisplayOption(settings.displayOption);
      setValueChanged(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = () => {
    setSettings({
      albumsPerPage: albumsPerPage,
      displayOption: displayOption,
    });
    setTimeout(() => {
      setValueChanged(false);
    }, 0);
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-4 ">
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View className="flex-1 items-center justify-start gap-8">
          <Text className="text-2xl font-bold text-textPrimary">
            {token ? "Jesteś zalogowany" : "Jesteś w trybie gościa"}
          </Text>

          <View className="w-full flex-1 flex-col justify-between">
            <View className="flex flex-col w-full gap-4 items-center">
              <Dropdown
                items={dropdownOptions}
                value={albumsPerPage}
                label="Foldery na stronę"
                setValueChanged={setValueChanged}
              />
              <Dropdown
                items={displayOptions}
                value={displayOption}
                label="Opcja wyświetlania"
                setValueChanged={setValueChanged}
              />
            </View>
            <View className="w-full">
              {valueChanged && (
                <View className="w-full flex flex-col items-center justify-between gap-4 ">
                  <Button
                    className=" "
                    onPress={handleSaveSettings}
                    isLoading={isLoading}
                    title="Zapisz"
                  ></Button>
                  <TouchableOpacity
                    onPress={handleResetSettings}
                    activeOpacity={0.7}
                    className="py-2"
                  >
                    <Text className="text-center text-gray-500">Anuluj</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
        {/* --- MODAL LOGOWANIA --- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="w-11/12 bg-white p-6 rounded-lg shadow-lg">
              <Text className="text-2xl font-bold text-secondary text-center mb-6">
                Zaloguj się
              </Text>
              <AuthForm formType="login" formFields={loginFormFields}>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  className="mt-4"
                >
                  <Text className="text-center text-gray-500">Anuluj</Text>
                </Pressable>
              </AuthForm>
            </View>
          </View>
        </Modal>
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
