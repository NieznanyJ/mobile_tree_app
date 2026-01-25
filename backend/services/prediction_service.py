import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

CLASS_TO_ID = {
    "Brzoza brodawkowata (Betula pendula)": "betula-pendula",
    "Buk zwyczajny (Fagus sylvatica)": "fagus-sylvatica",
    "Dąb szypułkowy (Quercus robur)": "quercus-robur",
    "Klon zwyczajny (Acer platanoides)": "acer-platanoides",
}

class PredictionService:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(PredictionService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not hasattr(self, 'model'):
            print("Inicjalizacja PredictionService: Ładowanie modelu i klas...")

            service_dir = os.path.dirname(os.path.abspath(__file__))
            model_path = os.path.abspath(os.path.join(service_dir, "..", "best_model.keras"))

            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Nie znaleziono pliku modelu w: {model_path}. "
                                      f"Upewnij się, że wytrenowany model `best_model.keras` znajduje się w folderze `backend`.")

            self.model = tf.keras.models.load_model(model_path)
            self.class_names = [
                "Brzoza brodawkowata (Betula pendula)",
                "Buk zwyczajny (Fagus sylvatica)",
                "Dąb szypułkowy (Quercus robur)",
                "Klon zwyczajny (Acer platanoides)"
            ]
            self.img_size = (300, 300)
            print("PredictionService zainicjalizowany pomyślnie.")

    def _process_image(self, image_bytes: bytes) -> tf.Tensor:
        img = Image.open(io.BytesIO(image_bytes))
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img = img.resize(self.img_size)
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0)
        return img_array

    def predict_single_probabilities(self, image_bytes: bytes) -> np.ndarray:
        processed_image = self._process_image(image_bytes)
        raw_predictions = self.model.predict(processed_image)
        probabilities = tf.nn.softmax(raw_predictions[0]).numpy()
        return probabilities

    def predict_multiple_images(self, images: list) -> dict:
        all_probs = []
        for image_bytes in images:
            probs = self.predict_single_probabilities(image_bytes)
            all_probs.append(probs)

        avg_probs = np.mean(all_probs, axis=0)
        class_index = int(np.argmax(avg_probs))
        predicted_class = self.class_names[class_index]
        confidence = float(np.max(avg_probs) * 100)

        return {
            "predicted_class": predicted_class,
            "tree_id": CLASS_TO_ID[predicted_class],
            "confidence": round(confidence, 2),
        }

# Tworzymy jedną, globalną instancję serwisu,
# która będzie używana przez zależności FastAPI.
prediction_service_instance = PredictionService()

def get_prediction_service():
    return prediction_service_instance
