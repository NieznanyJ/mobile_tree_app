"""
Prosty in-memory rate limiter dla FastAPI.
Dla produkcji zalecane jest użycie Redis.
"""
import time
from collections import defaultdict
from functools import wraps
from typing import Callable

from fastapi import HTTPException, Request, status


class RateLimiter:
    """
    Rate limiter oparty na sliding window.
    Przechowuje timestampy requestów per IP/klucz.
    """

    def __init__(self):
        # Słownik: klucz -> lista timestampów
        self._requests: dict[str, list[float]] = defaultdict(list)

    def _clean_old_requests(self, key: str, window_seconds: int) -> None:
        """Usuwa requesty starsze niż window."""
        now = time.time()
        cutoff = now - window_seconds
        self._requests[key] = [ts for ts in self._requests[key] if ts > cutoff]

    def is_rate_limited(
        self, key: str, max_requests: int, window_seconds: int
    ) -> tuple[bool, int]:
        """
        Sprawdza czy klucz przekroczył limit.
        Zwraca (czy_zablokowany, pozostałe_sekundy_do_resetu).
        """
        self._clean_old_requests(key, window_seconds)

        if len(self._requests[key]) >= max_requests:
            # Oblicz ile sekund do zwolnienia najstarszego slotu
            oldest = min(self._requests[key])
            retry_after = int(oldest + window_seconds - time.time()) + 1
            return True, max(retry_after, 1)

        # Dodaj nowy timestamp
        self._requests[key].append(time.time())
        return False, 0


# Globalna instancja rate limitera
rate_limiter = RateLimiter()


def rate_limit(max_requests: int = 5, window_seconds: int = 60):
    """
    Dependency do rate limitingu per IP.

    Użycie:
        @router.post("/login")
        def login(request: Request, _: None = Depends(rate_limit(5, 60))):
            ...
    """

    async def dependency(request: Request) -> None:
        # Użyj IP klienta jako klucza
        client_ip = request.client.host if request.client else "unknown"
        # Dodaj endpoint do klucza żeby limity były per-endpoint
        key = f"{client_ip}:{request.url.path}"

        is_limited, retry_after = rate_limiter.is_rate_limited(
            key, max_requests, window_seconds
        )

        if is_limited:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Zbyt wiele żądań. Spróbuj ponownie za {retry_after} sekund.",
                headers={"Retry-After": str(retry_after)},
            )

    return dependency
