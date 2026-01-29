"""
Serwis do przechowywania obrazów predykcji na dysku.
"""
import io
import shutil
import time
from pathlib import Path

from PIL import Image

# Katalog główny dla uploadów
UPLOAD_DIR = Path("uploads")

# Ustawienia kompresji
MAX_IMAGE_SIZE = (800, 800)
JPEG_QUALITY = 75


class FileStorageError(Exception):
    """Błąd podczas operacji na plikach."""
    pass


def compress_image(image_bytes: bytes) -> bytes:
    """
    Kompresuje obraz do max 800x800px i JPEG 75% jakości.

    Args:
        image_bytes: Surowe bajty obrazu

    Returns:
        Skompresowane bajty obrazu JPEG
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))

        # Konwersja do RGB (JPEG nie obsługuje alpha)
        if img.mode != "RGB":
            img = img.convert("RGB")

        # Zmiana rozmiaru z zachowaniem proporcji
        img.thumbnail(MAX_IMAGE_SIZE, Image.Resampling.LANCZOS)

        # Kompresja do JPEG
        output = io.BytesIO()
        img.save(output, format="JPEG", quality=JPEG_QUALITY, optimize=True)
        return output.getvalue()

    except Exception as e:
        raise FileStorageError(f"Nie udało się skompresować obrazu: {e}") from e


def save_prediction_images(user_id: int, images: list[bytes]) -> list[str]:
    """
    Zapisuje obrazy predykcji na dysk.

    Struktura: uploads/{user_id}/{timestamp}/image_{i}.jpg

    Args:
        user_id: ID użytkownika
        images: Lista bajtów obrazów

    Returns:
        Lista względnych ścieżek do zapisanych obrazów
    """
    timestamp = int(time.time())
    folder = UPLOAD_DIR / str(user_id) / str(timestamp)
    folder.mkdir(parents=True, exist_ok=True)

    paths = []
    for i, image_bytes in enumerate(images):
        # Kompresuj obraz przed zapisem
        compressed = compress_image(image_bytes)

        filename = f"image_{i}.jpg"
        filepath = folder / filename
        filepath.write_bytes(compressed)

        # Zapisz względną ścieżkę
        relative_path = str(filepath.relative_to(Path(".")))
        paths.append(relative_path)

    return paths


def get_image_url(relative_path: str) -> str:
    """
    Konwertuje względną ścieżkę do URL.

    Args:
        relative_path: Względna ścieżka do pliku

    Returns:
        URL do obrazu
    """
    return f"/{relative_path}"


def delete_prediction_images(image_paths: list[str]) -> None:
    """
    Usuwa obrazy predykcji z dysku.

    Args:
        image_paths: Lista ścieżek do usunięcia
    """
    if not image_paths:
        return

    # Znajdź folder nadrzędny (timestamp folder)
    folders_to_check = set()

    for path in image_paths:
        try:
            file_path = Path(path)
            if file_path.exists():
                file_path.unlink()
                folders_to_check.add(file_path.parent)
        except Exception:
            pass

    # Usuń puste foldery timestamp
    for folder in folders_to_check:
        try:
            if folder.exists() and not any(folder.iterdir()):
                folder.rmdir()

                # Sprawdź czy folder user_id też jest pusty
                parent = folder.parent
                if parent.exists() and not any(parent.iterdir()):
                    parent.rmdir()
        except Exception:
            pass


def delete_user_uploads(user_id: int) -> None:
    """
    Usuwa wszystkie uploady użytkownika.

    Args:
        user_id: ID użytkownika
    """
    user_folder = UPLOAD_DIR / str(user_id)
    if user_folder.exists():
        shutil.rmtree(user_folder, ignore_errors=True)
