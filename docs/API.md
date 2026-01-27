# Smart Tree API Documentation

## Base URL

```
http://localhost:8000
```

## Authentication

API używa JWT Bearer authentication. Token otrzymujesz po zalogowaniu.

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### Health Check

#### `GET /`

Sprawdza czy API działa.

**Response 200:**
```json
{
  "message": "Witaj w SMART TREE API!"
}
```

---

### Authentication

#### `POST /auth/register`

Rejestracja nowego użytkownika.

**Rate Limit:** 10 requests/minute

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePassword123!"
}
```

**Response 201:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "is_active": true
}
```

**Response 400:**
```json
{
  "detail": {
    "field": "email",
    "message": "Użytkownik o tym adresie email już istnieje."
  }
}
```

---

#### `POST /auth/login`

Logowanie użytkownika.

**Rate Limit:** 5 requests/minute

**Request Body (form-data):**
```
username=johndoe
password=SecurePassword123!
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "is_active": true
  }
}
```

**Response 401:**
```json
{
  "detail": "Nieprawidłowa nazwa użytkownika lub hasło"
}
```

---

#### `GET /auth/me`

Pobiera dane aktualnie zalogowanego użytkownika.

**Requires Authentication:** Yes

**Response 200:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "is_active": true
}
```

**Response 401:**
```json
{
  "detail": "Nieprawidłowy lub wygasły token"
}
```

---

### Prediction

#### `POST /predict/`

Rozpoznaje gatunek drzewa na podstawie 1-4 zdjęć.

**Requires Authentication:** Yes

**Request Body (multipart/form-data):**
```
image: [File] (1-4 image files)
```

**Example (curl):**
```bash
curl -X POST "http://localhost:8000/predict/" \
  -H "Authorization: Bearer <token>" \
  -F "image=@photo1.jpg" \
  -F "image=@photo2.jpg"
```

**Response 200:**
```json
{
  "predicted_class": "Dąb szypułkowy (Quercus robur)",
  "tree_id": "quercus-robur",
  "confidence": 87.45
}
```

**Response 400:**
```json
{
  "detail": "Wymagane od 1 do 4 zdjęć."
}
```

**Response 401:**
```json
{
  "detail": "Nieprawidłowy lub wygasły token"
}
```

---

## Rate Limiting

API ma ograniczenia liczby requestów:

| Endpoint | Limit |
|----------|-------|
| `/auth/login` | 5 req/min |
| `/auth/register` | 10 req/min |

**Response 429 (Too Many Requests):**
```json
{
  "detail": "Zbyt wiele żądań. Spróbuj ponownie za 45 sekund."
}
```

Headers:
```
Retry-After: 45
```

---

## Error Responses

### Validation Error (422)

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

### Server Error (500)

```json
{
  "detail": "Internal server error"
}
```

---

## Supported Tree Species

| ID | Name (PL) | Name (Latin) |
|----|-----------|--------------|
| `betula-pendula` | Brzoza brodawkowata | Betula pendula |
| `fagus-sylvatica` | Buk zwyczajny | Fagus sylvatica |
| `quercus-robur` | Dąb szypułkowy | Quercus robur |
| `acer-platanoides` | Klon zwyczajny | Acer platanoides |

---

## Interactive Docs

FastAPI automatycznie generuje dokumentację:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
