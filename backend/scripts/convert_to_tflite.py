"""
Skrypt do konwersji modelu Keras do formatów:
1. TFLite - dla natywnych aplikacji i React Native z expo-tfjs
2. TensorFlow.js - dla React Native z @tensorflow/tfjs-react-native

Użycie:
    cd backend
    python scripts/convert_to_tflite.py
"""

import json
import os
import shutil
import struct
import sys

# Dodaj ścieżkę do głównego katalogu backend
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import tensorflow as tf


def convert_keras_to_tflite(
    keras_model_path: str,
    tflite_output_path: str,
    quantize: bool = True,
) -> None:
    """
    Konwertuje model Keras do formatu TFLite.
    """
    print(f"Ładowanie modelu Keras z: {keras_model_path}")

    if not os.path.exists(keras_model_path):
        raise FileNotFoundError(f"Nie znaleziono modelu: {keras_model_path}")

    model = tf.keras.models.load_model(keras_model_path)
    print(f"Model załadowany. Input shape: {model.input_shape}")

    converter = tf.lite.TFLiteConverter.from_keras_model(model)

    if quantize:
        print("Stosowanie dynamic range quantization...")
        converter.optimizations = [tf.lite.Optimize.DEFAULT]

    print("Konwersja do TFLite...")
    tflite_model = converter.convert()

    with open(tflite_output_path, "wb") as f:
        f.write(tflite_model)

    keras_size = os.path.getsize(keras_model_path)
    tflite_size = os.path.getsize(tflite_output_path)
    reduction = (1 - tflite_size / keras_size) * 100

    print(f"\n{'=' * 50}")
    print(f"TFLite: Konwersja zakończona!")
    print(f"{'=' * 50}")
    print(f"Model Keras:  {keras_size / 1024 / 1024:.2f} MB")
    print(f"Model TFLite: {tflite_size / 1024 / 1024:.2f} MB")
    print(f"Redukcja:     {reduction:.1f}%")
    print(f"Plik: {tflite_output_path}")


def convert_keras_to_tfjs(keras_model_path: str, tfjs_output_dir: str) -> None:
    """
    Konwertuje model Keras do formatu TensorFlow.js (Layers Model).
    """
    print(f"\n{'=' * 50}")
    print("TensorFlow.js: Rozpoczynam konwersję...")
    print(f"{'=' * 50}")

    if not os.path.exists(keras_model_path):
        raise FileNotFoundError(f"Nie znaleziono modelu: {keras_model_path}")

    os.makedirs(tfjs_output_dir, exist_ok=True)

    # Wczytaj model
    model = tf.keras.models.load_model(keras_model_path)

    # Pobierz konfigurację modelu (topologia)
    model_config = model.get_config()

    # Pobierz wagi
    weights = model.get_weights()

    # Przygotuj manifest wag
    weights_manifest = []
    weights_data = b""
    offset = 0

    for i, layer in enumerate(model.layers):
        layer_weights = layer.get_weights()
        if not layer_weights:
            continue

        for j, w in enumerate(layer_weights):
            weight_name = f"{layer.name}/{['kernel', 'bias', 'gamma', 'beta', 'moving_mean', 'moving_variance'][j] if j < 6 else f'weight_{j}'}"

            # Konwertuj do float32
            w_float32 = w.astype(np.float32)
            w_bytes = w_float32.tobytes()

            weights_manifest.append(
                {
                    "name": weight_name,
                    "shape": list(w.shape),
                    "dtype": "float32",
                }
            )

            weights_data += w_bytes

    # Zapisz wagi
    weights_path = os.path.join(tfjs_output_dir, "group1-shard1of1.bin")
    with open(weights_path, "wb") as f:
        f.write(weights_data)

    weights_size = len(weights_data)
    print(f"Wagi zapisane: {weights_size / 1024 / 1024:.2f} MB")

    # Utwórz model.json z topologią Keras
    model_json = {
        "format": "layers-model",
        "generatedBy": "keras v" + tf.keras.__version__,
        "convertedBy": "convert_to_tflite.py",
        "modelTopology": {
            "keras_version": tf.keras.__version__,
            "backend": "tensorflow",
            "model_config": {"class_name": "Sequential", "config": model_config},
        },
        "weightsManifest": [
            {
                "paths": ["group1-shard1of1.bin"],
                "weights": weights_manifest,
            }
        ],
    }

    model_json_path = os.path.join(tfjs_output_dir, "model.json")
    with open(model_json_path, "w") as f:
        json.dump(model_json, f, indent=2)

    print(f"Utworzono: {model_json_path}")
    print(f"Utworzono: {weights_path}")
    print(f"Liczba warstw z wagami: {len(weights_manifest)}")


def main():
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    keras_model_path = os.path.join(backend_dir, "best_model.keras")

    tflite_output_path = os.path.join(backend_dir, "best_model.tflite")
    tfjs_output_dir = os.path.join(backend_dir, "tfjs_model")

    mobile_models_dir = os.path.join(backend_dir, "..", "mobile", "assets", "models")

    try:
        # 1. Konwertuj do TFLite
        convert_keras_to_tflite(
            keras_model_path=keras_model_path,
            tflite_output_path=tflite_output_path,
            quantize=True,
        )

        # 2. Konwertuj do TensorFlow.js
        convert_keras_to_tfjs(
            keras_model_path=keras_model_path,
            tfjs_output_dir=tfjs_output_dir,
        )

        # 3. Kopiuj pliki do mobile assets
        print(f"\n{'=' * 50}")
        print("Kopiowanie do mobile/assets/models/...")
        print(f"{'=' * 50}")

        os.makedirs(mobile_models_dir, exist_ok=True)

        # Kopiuj pliki TF.js
        for filename in os.listdir(tfjs_output_dir):
            src = os.path.join(tfjs_output_dir, filename)
            dst = os.path.join(mobile_models_dir, filename)
            if os.path.isfile(src):
                shutil.copy2(src, dst)
                size = os.path.getsize(src)
                print(f"  Skopiowano: {filename} ({size / 1024 / 1024:.2f} MB)")

        # Kopiuj TFLite
        tflite_dst = os.path.join(mobile_models_dir, "tree_classifier.tflite")
        shutil.copy2(tflite_output_path, tflite_dst)
        size = os.path.getsize(tflite_output_path)
        print(f"  Skopiowano: tree_classifier.tflite ({size / 1024 / 1024:.2f} MB)")

        print(f"\n{'=' * 50}")
        print("SUKCES! Wszystkie konwersje zakończone.")
        print(f"{'=' * 50}")

    except FileNotFoundError as e:
        print(f"Błąd: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Błąd podczas konwersji: {e}")
        import traceback

        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
