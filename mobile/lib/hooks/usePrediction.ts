import * as SecureStore from "expo-secure-store";
import { useCallback, useState } from "react";

import { compressImage } from "@/lib/utils/imageOptimization";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const TOKEN_KEY = "user-token";

export interface SinglePrediction {
  predicted_class: string;
  tree_id: string;
  confidence: number;
}

export interface PredictionResult {
  predictions: SinglePrediction[];
  predicted_class: string;
  tree_id: string;
  confidence: number;
}

export interface PredictionAsset {
  id: string;
  uri: string;
}

interface UsePredictionState {
  prediction: PredictionResult | null;
  isLoading: boolean;
  isCompressing: boolean;
  error: string | null;
}

interface UsePredictionReturn extends UsePredictionState {
  predict: (assets: PredictionAsset[]) => Promise<PredictionResult | null>;
  clearPrediction: () => void;
  clearError: () => void;
}

export function usePrediction(): UsePredictionReturn {
  const [state, setState] = useState<UsePredictionState>({
    prediction: null,
    isLoading: false,
    isCompressing: false,
    error: null,
  });

  const clearPrediction = useCallback(() => {
    setState((prev) => ({ ...prev, prediction: null }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const predict = useCallback(
    async (assets: PredictionAsset[]): Promise<PredictionResult | null> => {
      if (assets.length === 0) {
        setState((prev) => ({ ...prev, error: "Brak zdjęć do analizy" }));
        return null;
      }

      try {
        // Faza kompresji
        setState((prev) => ({
          ...prev,
          isCompressing: true,
          error: null,
        }));

        const compressedUris: string[] = [];
        for (const asset of assets) {
          const compressed = await compressImage(asset.uri);
          compressedUris.push(compressed.compressedUri);
        }

        // Faza wysyłania
        setState((prev) => ({
          ...prev,
          isCompressing: false,
          isLoading: true,
        }));

        // Przygotuj FormData
        const formData = new FormData();
        compressedUris.forEach((uri, i) => {
          formData.append("image", {
            uri,
            name: `image_${i}.jpeg`,
            type: "image/jpeg",
          } as any);
        });

        // Pobierz token autoryzacyjny
        const token = await SecureStore.getItemAsync(TOKEN_KEY);

        // Wyślij request
        const response = await fetch(`${API_URL}/predict/`, {
          method: "POST",
          body: formData,
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.detail || `Błąd serwera: ${response.status}`,
          );
        }

        const result: PredictionResult = await response.json();

        setState((prev) => ({
          ...prev,
          prediction: result,
          isLoading: false,
          isCompressing: false,
        }));

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Nieznany błąd";

        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
          isCompressing: false,
        }));

        console.error("Prediction failed:", error);
        return null;
      }
    },
    [],
  );

  return {
    ...state,
    predict,
    clearPrediction,
    clearError,
  };
}

export default usePrediction;
