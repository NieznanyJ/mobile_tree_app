"""
Serwis do predykcji gatunków drzew za pomocą modelu ML.
"""
import os
from dataclasses import dataclass

import numpy as np
import tensorflow as tf

from services.config import CLASS_NAMES, CLASS_TO_ID
from services.image_processing import ImageProcessingError, process_image


@dataclass
class SinglePrediction:
    """Pojedynczy wynik predykcji."""

    predicted_class: str
    tree_id: str
    confidence: float

    def to_dict(self) -> dict:
        """Konwertuje wynik do słownika."""
        return {
            "predicted_class": self.predicted_class,
            "tree_id": self.tree_id,
            "confidence": self.confidence,
        }


@dataclass
class PredictionResult:
    """Wynik predykcji gatunku drzewa - top 3 predykcje."""

    predictions: list[SinglePrediction]

    def to_dict(self) -> dict:
        """Konwertuje wynik do słownika (dla response JSON)."""
        if not self.predictions:
            return {
                "predictions": [],
                "predicted_class": "Nie rozpoznano drzewa",
                "tree_id": "",
                "confidence": 0.0,
            }
        return {
            "predictions": [p.to_dict() for p in self.predictions],
            "predicted_class": self.predictions[0].predicted_class,
            "tree_id": self.predictions[0].tree_id,
            "confidence": self.predictions[0].confidence,
        }


class PredictionService:
    """
    Singleton serwis do predykcji gatunków drzew.
    Model jest ładowany tylko raz przy pierwszej inicjalizacji.
    """

    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(PredictionService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not hasattr(self, "model"):
            self._initialize_model()

    def _initialize_model(self) -> None:
        """Ładuje model ML z dysku."""
        print("Inicjalizacja PredictionService: Ładowanie modelu...")

        service_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.abspath(
            os.path.join(service_dir, "..", "model_b0.keras")
        )

        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Nie znaleziono pliku modelu w: {model_path}. "
                f"Upewnij się, że `model_b0.keras` znajduje się w folderze `backend`."
            )

        self.model = tf.keras.models.load_model(model_path)
        self.class_names = CLASS_NAMES
        print("PredictionService zainicjalizowany pomyślnie.")

    def predict_single(self, image_bytes: bytes) -> np.ndarray:
        """
        Zwraca prawdopodobieństwa dla każdej klasy dla pojedynczego obrazu.

        Args:
            image_bytes: Surowe bajty obrazu

        Returns:
            Array prawdopodobieństw dla każdej klasy
        """
        processed_image = process_image(image_bytes)
        predictions = self.model.predict(processed_image, verbose=0)
        return predictions[0]

    def predict_multiple(self, images: list[bytes], top_k: int = 3) -> PredictionResult:
        """
        Predykcja na podstawie wielu obrazów (1-4).
        Uśrednia prawdopodobieństwa ze wszystkich obrazów i zwraca top K predykcji.

        Args:
            images: Lista bajtów obrazów
            top_k: Liczba najlepszych predykcji do zwrócenia (domyślnie 3)

        Returns:
            PredictionResult z listą top K predykcji
        """
        all_probs = []

        for image_bytes in images:
            probs = self.predict_single(image_bytes)
            all_probs.append(probs)

        MIN_TOP_CONFIDENCE = 0.40
        SECONDARY_RATIO = 0.30

        avg_probs = np.mean(all_probs, axis=0)
        sorted_indices = np.argsort(avg_probs)[::-1]
        top_confidence = float(avg_probs[sorted_indices[0]])

        if top_confidence < MIN_TOP_CONFIDENCE:
            return PredictionResult(predictions=[])

        min_secondary = top_confidence * SECONDARY_RATIO
        predictions = []
        for idx in sorted_indices:
            if float(avg_probs[idx]) < min_secondary or len(predictions) >= top_k:
                break
            class_name = self.class_names[idx]
            predictions.append(
                SinglePrediction(
                    predicted_class=class_name,
                    tree_id=CLASS_TO_ID[class_name],
                    confidence=round(float(avg_probs[idx]) * 100, 2),
                )
            )

        return PredictionResult(predictions=predictions)

    # Zachowanie kompatybilności wstecznej
    def predict_single_probabilities(self, image_bytes: bytes) -> np.ndarray:
        """Alias dla predict_single (kompatybilność wsteczna)."""
        return self.predict_single(image_bytes)

    def predict_multiple_images(self, images: list) -> dict:
        """Alias dla predict_multiple (kompatybilność wsteczna)."""
        return self.predict_multiple(images).to_dict()


# Globalna instancja serwisu
prediction_service_instance = PredictionService()


def get_prediction_service() -> PredictionService:
    """Dependency do użycia z FastAPI Depends()."""
    return prediction_service_instance
