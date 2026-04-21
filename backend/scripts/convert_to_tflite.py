"""
Skrypt do konwersji modeli Keras (B0/B3) do formatu TFLite.

Użycie:
    cd backend
    python scripts/convert_to_tflite.py --model b0
    python scripts/convert_to_tflite.py --model b3
"""

import argparse
import json
import os
import shutil
import sys

import numpy as np
import tensorflow as tf

TRAINER_MODELS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "..", "..", "model_trainer_E3", "model", "models",
)

MOBILE_MODELS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "..", "mobile", "assets", "models",
)

CLASSES = [
    {"name": "Brzoza brodawkowata (Betula pendula)", "id": "betula-pendula"},
    {"name": "Buk zwyczajny (Fagus sylvatica)",      "id": "fagus-sylvatica"},
    {"name": "Dąb szypułkowy (Quercus robur)",       "id": "quercus-robur"},
    {"name": "Jesion wyniosły (Fraxinus excelsior)",  "id": "fraxinus-excelsior"},
    {"name": "Kasztanowiec pospolity (Aesculus hippocastanum)", "id": "aesculus-hippocastanum"},
    {"name": "Klon zwyczajny (Acer platanoides)",    "id": "acer-platanoides"},
    {"name": "Sosna zwyczajna (Pinus sylvestris)",   "id": "pinus-sylvestris"},
    {"name": "Świerk pospolity (Picea abies)",        "id": "picea-abies"},
]

MODEL_CONFIG = {
    "b0": {"keras": "model_b0.keras", "size": 224, "tflite": "tree_classifier_b0.tflite"},
    "b3": {"keras": "model_b3.keras", "size": 300, "tflite": "tree_classifier_b3.tflite"},
}


def convert(model_choice: str, quantize: bool = True) -> None:
    cfg = MODEL_CONFIG[model_choice]
    keras_path = os.path.join(TRAINER_MODELS_DIR, cfg["keras"])

    if not os.path.exists(keras_path):
        raise FileNotFoundError(f"Nie znaleziono modelu: {keras_path}")

    print(f"\nŁadowanie modelu: {keras_path}")
    model = tf.keras.models.load_model(keras_path)
    print(f"Input shape: {model.input_shape}")

    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    if quantize:
        print("Stosowanie dynamic range quantization...")
        converter.optimizations = [tf.lite.Optimize.DEFAULT]

    print("Konwersja do TFLite...")
    tflite_model = converter.convert()

    os.makedirs(MOBILE_MODELS_DIR, exist_ok=True)
    tflite_dst = os.path.join(MOBILE_MODELS_DIR, cfg["tflite"])

    with open(tflite_dst, "wb") as f:
        f.write(tflite_model)

    keras_size  = os.path.getsize(keras_path)
    tflite_size = os.path.getsize(tflite_dst)
    print(f"\n{'=' * 50}")
    print(f"Model Keras:  {keras_size  / 1024 / 1024:.2f} MB")
    print(f"Model TFLite: {tflite_size / 1024 / 1024:.2f} MB  ({(1 - tflite_size/keras_size)*100:.1f}% mniejszy)")
    print(f"Zapisano: {tflite_dst}")

    img_size = cfg["size"]
    labels = {
        "classes": CLASSES,
        "imageSize": img_size,
        "inputShape": [1, img_size, img_size, 3],
    }
    labels_dst = os.path.join(MOBILE_MODELS_DIR, f"labels_{model_choice}.json")
    with open(labels_dst, "w", encoding="utf-8") as f:
        json.dump(labels, f, ensure_ascii=False, indent=2)
    print(f"Zapisano: {labels_dst}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", choices=["b0", "b3"], required=True, help="Model do konwersji")
    parser.add_argument("--no-quantize", action="store_true", help="Wyłącz quantization")
    args = parser.parse_args()

    try:
        convert(args.model, quantize=not args.no_quantize)
        print(f"\nSUKCES! Model {args.model.upper()} gotowy.")
    except Exception as e:
        print(f"Błąd: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
