# Smart Tree App - Architektura

## Przegląd

Aplikacja mobilna do rozpoznawania gatunków drzew na podstawie zdjęć przy użyciu machine learning.

## Struktura projektu

```
mobile_tree_app/
├── backend/                 # FastAPI backend (Python)
│   ├── core/               # Moduły podstawowe
│   │   ├── config.py       # Konfiguracja (Pydantic Settings)
│   │   ├── security.py     # JWT, hashowanie haseł
│   │   └── rate_limiter.py # Rate limiting
│   ├── db/                 # Warstwa bazy danych
│   │   └── database.py     # SQLAlchemy setup
│   ├── models/             # Modele ORM
│   │   └── user.py         # Model użytkownika
│   ├── routers/            # Endpointy API
│   │   ├── auth.py         # Autoryzacja
│   │   └── prediction.py   # Predykcja ML
│   ├── schemas/            # Pydantic schemas
│   │   ├── token.py        # Schematy tokenów
│   │   └── user.py         # Schematy użytkownika
│   ├── services/           # Logika biznesowa
│   │   ├── config/         # Konfiguracja serwisów
│   │   │   └── tree_config.py
│   │   ├── image_processing.py
│   │   ├── prediction_service.py
│   │   └── user_service.py
│   ├── tests/              # Testy pytest
│   └── main.py             # Entry point
│
├── mobile/                 # React Native frontend (Expo)
│   ├── app/                # Expo Router pages
│   │   ├── (auth)/         # Strony autoryzacji
│   │   ├── (tabs)/         # Główne taby
│   │   ├── (media-browser)/ # Przeglądarka mediów
│   │   └── tree/[id].tsx   # Szczegóły drzewa
│   ├── components/         # Komponenty React
│   │   ├── forms/          # Formularze
│   │   ├── modals/         # Modale
│   │   ├── skeletons/      # Loadery
│   │   └── ui/             # UI primitives
│   ├── lib/                # Logika i utilities
│   │   ├── context/        # React Context
│   │   ├── hooks/          # Custom hooks
│   │   ├── schemas/        # Zod validation
│   │   ├── store/          # Zustand stores
│   │   └── utils/          # Helpers
│   └── constants/          # Stałe
│
└── docs/                   # Dokumentacja
```

## Backend

### Architektura

Backend używa wzorca **Layered Architecture**:

```
┌─────────────────┐
│    Routers      │  ← Endpointy HTTP
├─────────────────┤
│    Services     │  ← Logika biznesowa
├─────────────────┤
│  Models/Schemas │  ← Dane
├─────────────────┤
│    Database     │  ← Persystencja
└─────────────────┘
```

### Technologie

- **FastAPI** - Framework webowy
- **SQLAlchemy** - ORM
- **Pydantic** - Walidacja danych
- **TensorFlow** - Model ML
- **bcrypt** - Hashowanie haseł
- **python-jose** - JWT

### Endpointy API

| Endpoint | Metoda | Opis | Auth |
|----------|--------|------|------|
| `/auth/register` | POST | Rejestracja | ❌ |
| `/auth/login` | POST | Logowanie | ❌ |
| `/auth/me` | GET | Aktualny user | ✅ |
| `/predict/` | POST | Predykcja ML | ✅ |

### Bezpieczeństwo

1. **JWT Authentication** - Tokeny ważne 30 minut
2. **Password Hashing** - bcrypt
3. **Rate Limiting** - 5 req/min na login, 10 req/min na register
4. **CORS** - Konfigurowane domeny

## Frontend (Mobile)

### Architektura

Frontend używa:

- **Expo Router** - File-based routing
- **Zustand** - State management (UI state)
- **React Context** - Auth state
- **NativeWind** - Tailwind CSS

### State Management

```
┌─────────────────────────────────┐
│         AuthContext             │  ← User, token, auth methods
├─────────────────────────────────┤
│  useAssetsStore (Zustand)       │  ← Selected images, albums
├─────────────────────────────────┤
│  useSettingsStore (Zustand)     │  ← UI preferences
└─────────────────────────────────┘
```

### Custom Hooks

| Hook | Opis |
|------|------|
| `useAuth` | Autoryzacja użytkownika |
| `usePrediction` | Kompresja + API call |
| `useImagePreview` | Modal podglądu obrazka |
| `useMediaLibrary` | Dostęp do galerii |

### Kluczowe komponenty

| Komponent | Opis |
|-----------|------|
| `ImageGridLayout` | Reużywalny grid 1-4 obrazków |
| `ConfidenceRing` | Animowany pierścień confidence |
| `PredictionModal` | Wynik predykcji |
| `Button` | Przycisk z wariantami |

## Flow predykcji

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Wybór   │ ──> │ Kompresja│ ──> │   API    │ ──> │  Wynik   │
│  zdjęć   │     │  zdjęć   │     │  /predict│     │  modal   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

1. User wybiera 1-4 zdjęcia
2. Zdjęcia są kompresowane (usePrediction hook)
3. FormData wysyłany do `/predict/`
4. Backend przetwarza obrazy i zwraca predykcję
5. Wynik wyświetlany w PredictionModal

## Uruchomienie

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd mobile
npm install
npx expo start
```

### Testy

```bash
cd backend
pytest
```

## Konfiguracja

### Backend (.env)

```env
DATABASE_URL="sqlite:///./db/smart_tree.db"
SECRET_KEY="your-secret-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS="http://localhost:3000,http://localhost:8081"
```

### Frontend (.env)

```env
EXPO_PUBLIC_API_URL="http://localhost:8000"
```

## Rozpoznawane gatunki drzew

1. Brzoza brodawkowata (Betula pendula)
2. Buk zwyczajny (Fagus sylvatica)
3. Dąb szypułkowy (Quercus robur)
4. Klon zwyczajny (Acer platanoides)
