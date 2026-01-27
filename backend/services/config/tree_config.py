"""
Konfiguracja klas drzew rozpoznawanych przez model ML.
"""

# Nazwy klas w kolejności zgodnej z modelem
CLASS_NAMES: list[str] = [
    "Brzoza brodawkowata (Betula pendula)",
    "Buk zwyczajny (Fagus sylvatica)",
    "Dąb szypułkowy (Quercus robur)",
    "Klon zwyczajny (Acer platanoides)",
]

# Mapowanie nazw klas na ID używane w aplikacji
CLASS_TO_ID: dict[str, str] = {
    "Brzoza brodawkowata (Betula pendula)": "betula-pendula",
    "Buk zwyczajny (Fagus sylvatica)": "fagus-sylvatica",
    "Dąb szypułkowy (Quercus robur)": "quercus-robur",
    "Klon zwyczajny (Acer platanoides)": "acer-platanoides",
}

# Rozmiar obrazu wymagany przez model
IMAGE_SIZE: tuple[int, int] = (300, 300)

# Liczba klas
NUM_CLASSES: int = len(CLASS_NAMES)
