"""
Serwis do przetwarzania obrazów przed predykcją.
"""
import io

import numpy as np
import tensorflow as tf
from PIL import Image

from services.config import IMAGE_SIZE


class ImageProcessingError(Exception):
    """Błąd podczas przetwarzania obrazu."""

    pass


def process_image(image_bytes: bytes) -> tf.Tensor:
    """
    Przetwarza surowe bajty obrazu do formatu wymaganego przez model.

    Args:
        image_bytes: Surowe bajty obrazu (np. z uploadu)

    Returns:
        Tensor gotowy do predykcji (batch_size=1, height, width, channels)

    Raises:
        ImageProcessingError: Gdy obraz jest uszkodzony lub w nieobsługiwanym formacie
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))

        # Konwersja do RGB jeśli potrzebne (np. PNG z alpha channel, grayscale)
        if img.mode != "RGB":
            img = img.convert("RGB")

        # Skalowanie do rozmiaru wymaganego przez model
        img = img.resize(IMAGE_SIZE)

        # Konwersja do tensora
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0)

        return img_array

    except Exception as e:
        raise ImageProcessingError(f"Nie udało się przetworzyć obrazu: {e}") from e


def validate_image(image_bytes: bytes) -> bool:
    """
    Sprawdza czy obraz jest prawidłowy.

    Args:
        image_bytes: Surowe bajty obrazu

    Returns:
        True jeśli obraz jest prawidłowy
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
        return True
    except Exception:
        return False
