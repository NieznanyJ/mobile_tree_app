/**
 * Serwis do lokalnej predykcji za pomocą react-native-fast-tflite
 *
 * Odpowiedzialności:
 * - Ładowanie modelu TFLite do pamięci
 * - Preprocessing obrazu (resize 224x224, RGB)
 * - Inference za pomocą JSI (natywna wydajność)
 * - Postprocessing (argmax, confidence)
 *
 * Model: EfficientNet B0 (4.65 MB)
 * Input: (1, 224, 224, 3) - RGB [0-255] (EfficientNet ma wbudowaną normalizację)
 * Output: (1, 4) - Softmax probabilities
 */

import * as ImageManipulator from "expo-image-manipulator";
import * as jpeg from "jpeg-js";
import { loadTensorflowModel, TensorflowModel } from "react-native-fast-tflite";

import labelsData from "@/assets/models/labels.json";

// Konfiguracja z labels.json
const IMAGE_SIZE = labelsData.imageSize; // 224
const CLASSES = labelsData.classes;

export interface SingleLocalPrediction {
  predicted_class: string;
  tree_id: string;
  confidence: number;
}

export interface LocalPredictionResult {
  predictions: SingleLocalPrediction[];
  // Dla kompatybilności - główna predykcja
  predicted_class: string;
  tree_id: string;
  confidence: number;
}

class TFLiteService {
  private model: TensorflowModel | null = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;
  private initError: string | null = null;

  /**
   * Inicjalizuje react-native-fast-tflite i ładuje model.
   * Bezpieczne do wielokrotnego wywołania - zwraca istniejący promise jeśli inicjalizacja trwa.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initError) throw new Error(this.initError);

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._doInitialize();
    return this.initPromise;
  }

  private async _doInitialize(): Promise<void> {
    try {
      // Ładowanie modelu TFLite
      console.log("[TFLite] Ładowanie modelu tree_classifier.tflite...");
      this.model = await loadTensorflowModel(
        require("@/assets/models/tree_classifier.tflite"),
      );

      console.log("[TFLite] Model załadowany pomyślnie");

      this.isInitialized = true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Nieznany błąd";
      console.error("[TFLite] Błąd inicjalizacji:", errorMsg);

      this.initError = `Model ML niedostępny: ${errorMsg}`;
      this.initPromise = null;
      this.isInitialized = false;
    }
  }

  /**
   * Sprawdza czy model jest załadowany i gotowy do użycia.
   */
  isReady(): boolean {
    return this.isInitialized && this.model !== null;
  }

  /**
   * Zwraca błąd inicjalizacji jeśli wystąpił.
   */
  getInitError(): string | null {
    return this.initError;
  }

  /**
   * Przetwarza obraz do Float32Array dla modelu.
   * 1. Resize do 224x224
   * 2. Dekoduj JPEG do RGBA
   * 3. Konwertuj RGBA do RGB [0-255] (bez normalizacji - EfficientNet normalizuje wewnętrznie)
   */
  private async preprocessImage(imageUri: string): Promise<Float32Array> {
    // Skaluj obraz do wymaganego rozmiaru
    let manipulated;
    try {
      manipulated = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: IMAGE_SIZE, height: IMAGE_SIZE } }],
        {
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
          compress: 1.0,
        },
      );
    } catch (error) {
      console.error("[TFLite] Błąd ImageManipulator:", error);
      throw new Error(`Nie udało się przetworzyć obrazu: ${imageUri}`);
    }

    if (!manipulated.base64) {
      throw new Error("Nie udało się przetworzyć obrazu - brak base64");
    }

    // Dekoduj base64 do Uint8Array
    const binaryString = atob(manipulated.base64);
    const jpegData = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      jpegData[i] = binaryString.charCodeAt(i);
    }

    // Dekoduj JPEG do RGBA używając jpeg-js
    let rawImageData;
    try {
      rawImageData = jpeg.decode(jpegData, { useTArray: true });
    } catch (error) {
      console.error("[TFLite] Błąd jpeg.decode:", error);
      throw new Error(`Nie udało się zdekodować JPEG: ${imageUri}`);
    }

    if (!rawImageData || !rawImageData.data) {
      throw new Error(
        `jpeg.decode zwrócił nieprawidłowe dane dla: ${imageUri}`,
      );
    }

    // Konwertuj RGBA do RGB (bez normalizacji - EfficientNet ma wbudowaną warstwę normalizacji)
    // Model był trenowany z tf.keras.utils.image_dataset_from_directory() która zwraca [0, 255]
    const floatData = new Float32Array(IMAGE_SIZE * IMAGE_SIZE * 3);
    const rgbaData = rawImageData.data;

    for (let i = 0; i < IMAGE_SIZE * IMAGE_SIZE; i++) {
      const rgbaIdx = i * 4;
      const rgbIdx = i * 3;

      floatData[rgbIdx] = rgbaData[rgbaIdx]; // R [0-255]
      floatData[rgbIdx + 1] = rgbaData[rgbaIdx + 1]; // G [0-255]
      floatData[rgbIdx + 2] = rgbaData[rgbaIdx + 2]; // B [0-255]
    }

    return floatData;
  }

  /**
   * Wykonuje predykcję na pojedynczym obrazie.
   */
  async predictSingle(imageUri: string): Promise<number[]> {
    if (!this.isReady() || !this.model) {
      throw new Error("Model nie jest zainicjalizowany");
    }

    console.log("[TFLite] predictSingle - URI:", imageUri);

    // Preprocessing
    const inputData = await this.preprocessImage(imageUri);

    // Walidacja danych wejściowych
    if (!inputData || inputData.length !== IMAGE_SIZE * IMAGE_SIZE * 3) {
      throw new Error(
        `Nieprawidłowy rozmiar danych wejściowych: ${inputData?.length}, oczekiwano: ${IMAGE_SIZE * IMAGE_SIZE * 3}`,
      );
    }

    console.log("[TFLite] inputData ready, length:", inputData.length);
    console.log(
      "[TFLite] inputData sample (first 10):",
      Array.from(inputData.slice(0, 10)),
    );

    // Inference - react-native-fast-tflite przyjmuje array of TypedArrays
    console.log("[TFLite] Wywołuję model.runSync...");
    const outputs = this.model.runSync([inputData]);

    if (!outputs || !outputs[0]) {
      throw new Error("Model nie zwrócił wyników");
    }

    // Output to tablica softmax probabilities
    const probabilities = outputs[0];
    console.log(
      "[TFLite] Wynik predykcji:",
      Array.from(probabilities as Float32Array),
    );

    return Array.from(probabilities as Float32Array);
  }

  /**
   * Wykonuje predykcję na wielu obrazach (1-4).
   * Uśrednia prawdopodobieństwa ze wszystkich obrazów i zwraca top 3.
   */
  async predictMultiple(
    imageUris: string[],
    topK: number = 3,
  ): Promise<LocalPredictionResult> {
    if (imageUris.length === 0) {
      throw new Error("Brak obrazów do predykcji");
    }

    // Zbierz prawdopodobieństwa ze wszystkich obrazów
    const allProbabilities: number[][] = [];

    for (const uri of imageUris) {
      const probs = await this.predictSingle(uri);
      allProbabilities.push(probs);
    }

    // Uśrednianie prawdopodobieństw
    const avgProbabilities = new Array(CLASSES.length).fill(0);
    for (const probs of allProbabilities) {
      for (let i = 0; i < probs.length; i++) {
        avgProbabilities[i] += probs[i];
      }
    }
    for (let i = 0; i < avgProbabilities.length; i++) {
      avgProbabilities[i] /= allProbabilities.length;
    }

    // Stwórz tablicę indeksów i posortuj malejąco wg prawdopodobieństwa
    const indices = avgProbabilities.map((_, i) => i);
    indices.sort((a, b) => avgProbabilities[b] - avgProbabilities[a]);

    // Weź top K predykcji
    const topIndices = indices.slice(0, topK);
    const predictions: SingleLocalPrediction[] = topIndices.map((idx) => ({
      predicted_class: CLASSES[idx].name,
      tree_id: CLASSES[idx].id,
      confidence: Math.round(avgProbabilities[idx] * 100 * 100) / 100,
    }));

    // Główna predykcja (pierwsza z listy)
    const topPrediction = predictions[0];

    return {
      predictions,
      predicted_class: topPrediction.predicted_class,
      tree_id: topPrediction.tree_id,
      confidence: topPrediction.confidence,
    };
  }

  /**
   * Zwalnia zasoby modelu.
   */
  dispose(): void {
    this.model = null;
    this.isInitialized = false;
    this.initPromise = null;
    this.initError = null;
  }
}

// Singleton instance
export const tfliteService = new TFLiteService();
