/**
 * Hook do lokalnej predykcji za pomocą TensorFlow.js na telefonie.
 *
 * Używany gdy:
 * - User jest gościem (niezalogowany)
 * - User jest offline (zalogowany lub gość)
 */

import { useCallback, useEffect, useState } from "react";

import {
  LocalPredictionResult,
  tfliteService,
} from "@/lib/services/tfliteService";

import type { PredictionAsset, PredictionResult } from "./usePrediction";

interface UseLocalPredictionState {
  prediction: PredictionResult | null;
  isModelLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseLocalPredictionReturn extends UseLocalPredictionState {
  predict: (assets: PredictionAsset[]) => Promise<PredictionResult | null>;
  clearPrediction: () => void;
  clearError: () => void;
}

export function useLocalPrediction(): UseLocalPredictionReturn {
  const [state, setState] = useState<UseLocalPredictionState>({
    prediction: null,
    isModelLoaded: false,
    isLoading: false,
    error: null,
  });

  // Inicjalizacja modelu przy pierwszym renderze
  useEffect(() => {
    let isMounted = true;

    const initModel = async () => {
      try {
        await tfliteService.initialize();

        if (isMounted) {
          if (tfliteService.isReady()) {
            setState((prev) => ({ ...prev, isModelLoaded: true, error: null }));
          } else {
            // Model nie załadował się, ale nie rzucił błędu
            const errorMsg = tfliteService.getInitError() || "Model ML niedostępny";
            console.log("[useLocalPrediction] Model niedostępny:", errorMsg);
            setState((prev) => ({
              ...prev,
              error: errorMsg,
              isModelLoaded: false,
            }));
          }
        }
      } catch (error) {
        console.error("[useLocalPrediction] Błąd ładowania modelu:", error);
        if (isMounted) {
          const errorMsg =
            tfliteService.getInitError() ||
            (error instanceof Error
              ? error.message
              : "Nie udało się załadować modelu ML");
          setState((prev) => ({
            ...prev,
            error: errorMsg,
            isModelLoaded: false,
          }));
        }
      }
    };

    initModel();

    return () => {
      isMounted = false;
    };
  }, []);

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

      if (!tfliteService.isReady()) {
        const initError = tfliteService.getInitError();
        setState((prev) => ({
          ...prev,
          error: initError || "Model ML nie jest jeszcze gotowy. Spróbuj ponownie za chwilę.",
        }));
        return null;
      }

      try {
        setState((prev) => ({
          ...prev,
          isLoading: true,
          error: null,
        }));

        // Zbierz URIs z assetów
        const imageUris = assets.map((asset) => asset.uri);

        // Wykonaj lokalną predykcję
        const localResult: LocalPredictionResult =
          await tfliteService.predictMultiple(imageUris);

        // Konwertuj do standardowego formatu PredictionResult
        const result: PredictionResult = {
          predictions: localResult.predictions,
          predicted_class: localResult.predicted_class,
          tree_id: localResult.tree_id,
          confidence: localResult.confidence,
        };

        setState((prev) => ({
          ...prev,
          prediction: result,
          isLoading: false,
        }));

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Nieznany błąd";

        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }));

        console.error("[useLocalPrediction] Błąd predykcji:", error);
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

export default useLocalPrediction;
