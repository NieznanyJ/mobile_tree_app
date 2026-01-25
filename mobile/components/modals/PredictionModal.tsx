import { router } from "expo-router";
import React from "react";
import {
  Modal,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PredictionSkeleton from "@/components/skeletons/PredictionSkeleton";
import ConfidenceRing from "@/components/ui/ConfidenceRing";
import Overlay from "@/components/ui/Overlay";

export interface PredictionResult {
  predicted_class: string;
  tree_id: string;
  confidence: number;
}

interface PredictionModalProps {
  prediction: PredictionResult | null;
  setPrediction: (val: PredictionResult | null) => void;
  isLoading: boolean;
}

export default function PredictionModal({
  prediction,
  setPrediction,
  isLoading,
}: PredictionModalProps) {
  const visible = isLoading || prediction !== null;

  const handleClose = () => {
    setPrediction(null);
  };

  const handleLearnMore = () => {
    if (prediction) {
      router.push(`/tree/${prediction.tree_id}` as any);
      setPrediction(null);
    }
  };

  return (
    <>
      <Overlay isVisible={visible} />
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View className="flex-1 justify-end">
            <TouchableWithoutFeedback>
              <View
                className="bg-white rounded-t-3xl p-6"
                style={{ height: "55%" }}
              >
                <SafeAreaView className="flex-1 items-center justify-center">
                  {isLoading ? (
                    <PredictionSkeleton />
                  ) : prediction ? (
                    <View style={{ alignItems: "center", gap: 16 }}>
                      <ConfidenceRing confidence={prediction.confidence} />
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "600",
                          color: "#111827",
                          textAlign: "center",
                          marginTop: 8,
                        }}
                      >
                        {prediction.predicted_class}
                      </Text>
                      <Text style={{ fontSize: 14, color: "#6b7280" }}>
                        Pewność: {prediction.confidence.toFixed(1)}%
                      </Text>
                      <Pressable
                        onPress={handleLearnMore}
                        style={{
                          backgroundColor: "#00964a",
                          paddingHorizontal: 24,
                          paddingVertical: 12,
                          borderRadius: 22,
                          marginTop: 8,
                        }}
                      >
                        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>
                          Dowiedz się więcej
                        </Text>
                      </Pressable>
                      <Pressable onPress={handleClose} style={{ marginTop: 4 }}>
                        <Text style={{ color: "#6b7280", fontSize: 14 }}>
                          Zamknij
                        </Text>
                      </Pressable>
                    </View>
                  ) : null}
                </SafeAreaView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
