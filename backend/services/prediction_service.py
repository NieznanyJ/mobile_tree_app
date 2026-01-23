import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

class PredictionService:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(PredictionService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        # Ten warunek zapewnia, że model jest ładowany z dysku tylko raz.
        if not hasattr(self, 'model'):
            print("Inicjalizacja PredictionService: Ładowanie modelu i klas...")
            
            # Budujemy ścieżkę do modelu w sposób odporny na to, skąd uruchamiany jest skrypt
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
        """
        Prywatna metoda do przetwarzania obrazu.
        """
        # Otwieramy obraz z surowych bajtów
        img = Image.open(io.BytesIO(image_bytes))

        # Upewniamy się, że obraz ma 3 kanały (RGB)
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Zmieniamy rozmiar do oczekiwanego przez model
        img = img.resize(self.img_size)

        # Konwertujemy obraz na tablicę i dodajemy wymiar "batch"
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0) # Kształt (1, 300, 300, 3)

        return img_array

    def predict_image(self, image_bytes: bytes) -> dict:
        """
        Wykonuje pełny proces predykcji dla danego obrazu.
        """
        # Przetwarzanie obrazu
        processed_image = self._process_image(image_bytes)
        
        # Predykcja za pomocą modelu
        raw_predictions = self.model.predict(processed_image)
        
        # Konwersja wyników na czytelny format
        score = tf.nn.softmax(raw_predictions[0])
        class_index = np.argmax(score)
        predicted_class = self.class_names[class_index]
        confidence = np.max(score) * 100

        return {
            "predicted_class": predicted_class,
            "confidence": f"{confidence:.2f}%"
        }

# Tworzymy jedną, globalną instancję serwisu,
# która będzie używana przez zależności FastAPI.
prediction_service_instance = PredictionService()

def get_prediction_service():
    return prediction_service_instance
