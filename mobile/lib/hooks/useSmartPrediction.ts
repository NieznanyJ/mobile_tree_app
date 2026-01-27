/**
 * Hook inteligentnego wyboru strategii predykcji.
 *
 * Strategia:
 * - Serwer: zalogowany + online - usePrediction (serwer API)
 * - Lokalnie: gość LUB offline - useLocalPrediction (TFLite na telefonie)
 */

import { useCallback } from "react";

import { useAuth } from "@/lib/context/AuthContext";

import { useLocalPrediction } from "./useLocalPrediction";
import {
  PredictionAsset,
  PredictionResult,
  usePrediction,
} from "./usePrediction";

export type PredictionSource = "server" | "local";

interface UseSmartPredictionReturn {
  predict: (assets: PredictionAsset[]) => Promise<PredictionResult | null>;
  prediction: PredictionResult | null;
  isLoading: boolean;
  isCompressing: boolean;
  error: string | null;
  clearPrediction: () => void;
  clearError: () => void;
  source: PredictionSource;
  isModelLoaded: boolean;
}

export function useSmartPrediction(): UseSmartPredictionReturn {
  const { isOnline, isGuest, token } = useAuth();

  const remote = usePrediction();
  const local = useLocalPrediction();

  // Określ źródło predykcji
  const shouldUseServer = isOnline && !isGuest && !!token;
  const source: PredictionSource = shouldUseServer ? "server" : "local";

  const predict = useCallback(
    async (assets: PredictionAsset[]): Promise<PredictionResult | null> => {
      if (shouldUseServer) {
        console.log("[SmartPrediction] Używam serwera API");
        return remote.predict(assets);
      } else {
        console.log(
          `[SmartPrediction] Używam lokalnego modelu (isOnline=${isOnline}, isGuest=${isGuest}, token=${!!token})`,
        );
        return local.predict(assets);
      }
    },
    [shouldUseServer, remote, local, isOnline, isGuest, token],
  );

  const clearPrediction = useCallback(() => {
    remote.clearPrediction();
    local.clearPrediction();
  }, [remote, local]);

  const clearError = useCallback(() => {
    remote.clearError();
    local.clearError();
  }, [remote, local]);

  // Połącz stany z odpowiedniego źródła
  const currentState = shouldUseServer ? remote : local;

  return {
    predict,
    prediction: currentState.prediction,
    isLoading: currentState.isLoading,
    isCompressing: shouldUseServer ? remote.isCompressing : false,
    error: currentState.error,
    clearPrediction,
    clearError,
    source,
    isModelLoaded: local.isModelLoaded,
  };
}

export default useSmartPrediction;
