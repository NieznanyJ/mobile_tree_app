import {
  Button,
  Modal,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Overlay from "../ui/Overlay";

export default function PredictionModal({ prediction, setPrediction }) {
  return (
    <>
      <Overlay isVisible={!!prediction} />
      <Modal
        visible={!!prediction}
        animationType="slide"
        transparent={true} // <-- to ważne!
      >
        {/* Tło półprzezroczyste */}
        <TouchableWithoutFeedback onPress={() => setPrediction(null)}>
          <View className="flex-1 justify-end">
            {/* Kontener modala (50% wysokości) */}
            <TouchableWithoutFeedback>
              <View
                className="bg-white rounded-t-3xl p-6"
                style={{ height: "50%" }}
              >
                <SafeAreaView className="flex-1 items-center justify-center">
                  <Text className="text-2xl font-semibold mb-4">
                    Wynik predykcji
                  </Text>
                  <Text className="text-lg mb-4">
                    {prediction
                      ? `To jest drzewo gatunku: ${prediction}`
                      : "Brak wyniku predykcji"}
                  </Text>
                  <Button title="Zamknij" onPress={() => setPrediction(null)} />
                </SafeAreaView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
