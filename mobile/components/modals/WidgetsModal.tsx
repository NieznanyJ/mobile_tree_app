import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useSettingsStore } from "@/lib/store/settingsStore";

interface WidgetsModalProps {
  visible: boolean;
  onClose: () => void;
}

interface WidgetItem {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const widgets: WidgetItem[] = [
  { id: "treeFacts", name: "Ciekawostki o drzewach", icon: "eco" },
  // { id: "recentPhotos", name: "Ostatnie zdjęcia", icon: "photo-library" },
  // { id: "albums", name: "Foldery", icon: "folder" },
];

export default function WidgetsModal({ visible, onClose }: WidgetsModalProps) {
  const { activeWidgets, toggleWidget } = useSettingsStore();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-2xl w-11/12 max-w-md"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold">Widgety</Text>
              <Pressable onPress={onClose}>
                <MaterialIcons name="close" size={24} color="#666" />
              </Pressable>
            </View>

            <ScrollView className="max-h-96">
              <View className="gap-3">
                {widgets.map((widget) => {
                  const isActive = activeWidgets[widget.id] ?? false;

                  return (
                    <Pressable
                      key={widget.id}
                      onPress={() => toggleWidget(widget.id)}
                      className={`flex-row items-center p-4 rounded-xl border-2 ${isActive
                        ? "bg-secondary border-secondary"
                        : "bg-white border-gray-200"
                        }`}
                    >
                      <MaterialIcons
                        name={widget.icon}
                        size={28}
                        color={isActive ? "#fff" : "#666"}
                      />
                      <Text
                        className={`ml-4 text-lg font-semibold ${isActive ? "text-white" : "text-gray-800"
                          }`}
                      >
                        {widget.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
