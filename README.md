# Smart Tree

A mobile app that recognises tree species from photos. Built as an engineering thesis project: a React Native (Expo) client, a FastAPI backend, and an EfficientNet-B3 image classifier that runs both on the server and on the device.

The app UI and the API messages are in Polish.

<!-- TODO: add 2-3 screenshots here (identify screen, result, atlas), e.g. docs/screenshots/*.png -->

## Features

- **Identification from 1-4 photos**, taken with the camera or picked from the gallery. Probabilities are averaged across the photos and up to three most likely species are returned with a confidence score.
- **Two prediction modes.** Signed-in users who are online get predictions from the server model. Guests and offline users get predictions from a TensorFlow Lite model running on the phone.
- **Prediction history** for signed-in users, with the photos, cursor-based pagination and delete.
- **Tree atlas** with descriptions, occurrence and photos of every supported species.
- **Accounts**: registration, login with JWT, and a guest mode with limited features.

### Supported species

| Polish name | Latin name |
| --- | --- |
| Brzoza brodawkowata | *Betula pendula* |
| Buk zwyczajny | *Fagus sylvatica* |
| Dąb szypułkowy | *Quercus robur* |
| Jesion wyniosły | *Fraxinus excelsior* |
| Kasztanowiec pospolity | *Aesculus hippocastanum* |
| Klon zwyczajny | *Acer platanoides* |
| Sosna zwyczajna | *Pinus sylvestris* |
| Świerk pospolity | *Picea abies* |

## Tech stack

| Part | Technologies |
| --- | --- |
| Mobile | React Native 0.81, Expo 54, Expo Router, TypeScript, NativeWind (Tailwind CSS), Zustand, React Hook Form + Zod |
| On-device ML | `react-native-fast-tflite`, TensorFlow Lite |
| Backend | Python, FastAPI, SQLAlchemy, SQLite, Pydantic |
| Server ML | TensorFlow / Keras, Pillow |
| Auth | JWT (`python-jose`), bcrypt (`passlib`), `expo-secure-store` on the device |
| Tests | pytest, FastAPI `TestClient` |

## How prediction works

```
                       signed in and online?
                        /                 \
                      yes                  no (guest or offline)
                       |                    |
        compress photos, POST /predict/     resize to 300x300 on the device
                       |                    |
          Keras model on the server         TFLite model on the phone
                       \                    /
              average probabilities across photos
                              |
        top result under 40%  ->  "tree not recognised"
        otherwise             ->  up to 3 species, each at least 30% of the top score
```

Server predictions are saved to the user's history together with the uploaded photos. Local predictions are not stored.

## Project structure

```
backend/
  core/        settings, JWT and password hashing, rate limiter
  db/          SQLAlchemy engine and session
  models/      ORM models (User, PredictionHistory)
  schemas/     Pydantic schemas
  routers/     auth, prediction, history endpoints
  services/    prediction, image processing, file storage, history, users
  scripts/     Keras -> TFLite conversion
  tests/       pytest tests
mobile/
  app/         screens (Expo Router): auth, tabs, camera, history, atlas, settings
  components/  UI components, forms, modals, skeletons
  lib/         auth and theme context, hooks, TFLite service, Zustand stores
  assets/      atlas data, species photos, model labels
docs/          architecture and API notes (in Polish)
```

## Running locally

The trained model files are not part of this repository (they are too large and are git-ignored), so the app cannot be run from a fresh clone without them:

| File | Used by |
| --- | --- |
| `backend/model_b3.keras` | server predictions (loaded when the API starts) |
| `mobile/assets/models/tree_classifier_b3.tflite` | on-device predictions |

`backend/scripts/convert_to_tflite.py` converts the Keras model to TFLite.

### Backend

Requires Python 3.9-3.11 (TensorFlow 2.14).

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL="sqlite:///./db/smart_tree.db"
SECRET_KEY="<at least 32 characters>"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS="http://localhost:8081"
```

Generate a key with `python -c "import secrets; print(secrets.token_urlsafe(32))"`. The API refuses to start with a short or well-known key.

```bash
uvicorn main:app --reload
```

The API runs at `http://localhost:8000`, with interactive Swagger docs at `http://localhost:8000/docs`.

### Mobile

The app uses a native TFLite module, so it needs a development build and does not run in Expo Go.

```bash
cd mobile
npm install
```

Create `mobile/.env` with the address of the backend (use your computer's LAN address when testing on a physical phone):

```env
EXPO_PUBLIC_API_URL="http://192.168.1.10:8000"
```

```bash
npx expo run:android     # or: npx expo run:ios
```

## API

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/` | Health check | no |
| POST | `/auth/register` | Create an account (10 requests/min per IP) | no |
| POST | `/auth/login` | Log in, returns a JWT (5 requests/min per IP) | no |
| GET | `/auth/me` | Current user | yes |
| POST | `/predict/` | Identify a tree from 1-4 images (`multipart/form-data`, field `image`) | yes |
| GET | `/predictions/` | Prediction history (`limit`, `cursor`) | yes |
| GET | `/predictions/{id}` | One prediction with all results | yes |
| DELETE | `/predictions/{id}` | Delete one prediction | yes |
| DELETE | `/predictions/` | Clear the whole history | yes |

Authenticated requests send `Authorization: Bearer <token>`. More detail in [docs/API.md](docs/API.md) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Tests

```bash
cd backend
pip install pytest
pytest
```

26 tests cover registration and login, password hashing and JWT handling, and the rate limiter. They run against an in-memory SQLite database. Importing the app loads the model, so `model_b3.keras` has to be present.

## Author

Jakub Nieznany - [LinkedIn](https://linkedin.com/in/jakub-nieznany-491551204)
