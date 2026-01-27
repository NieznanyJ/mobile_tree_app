"""
Tests for rate limiter module.
"""
import pytest
import time

from core.rate_limiter import RateLimiter


class TestRateLimiter:
    """Tests for RateLimiter class."""

    def test_allows_requests_under_limit(self):
        """Test that requests under limit are allowed."""
        limiter = RateLimiter()

        for i in range(5):
            is_limited, _ = limiter.is_rate_limited("test_key", max_requests=5, window_seconds=60)
            assert is_limited is False

    def test_blocks_requests_over_limit(self):
        """Test that requests over limit are blocked."""
        limiter = RateLimiter()

        # Make 5 requests (at limit)
        for i in range(5):
            limiter.is_rate_limited("test_key", max_requests=5, window_seconds=60)

        # 6th request should be blocked
        is_limited, retry_after = limiter.is_rate_limited("test_key", max_requests=5, window_seconds=60)

        assert is_limited is True
        assert retry_after > 0

    def test_different_keys_are_independent(self):
        """Test that different keys have independent limits."""
        limiter = RateLimiter()

        # Exhaust limit for key1
        for i in range(5):
            limiter.is_rate_limited("key1", max_requests=5, window_seconds=60)

        # key1 should be limited
        is_limited, _ = limiter.is_rate_limited("key1", max_requests=5, window_seconds=60)
        assert is_limited is True

        # key2 should not be limited
        is_limited, _ = limiter.is_rate_limited("key2", max_requests=5, window_seconds=60)
        assert is_limited is False

    def test_window_reset(self):
        """Test that old requests are cleaned up after window expires."""
        limiter = RateLimiter()

        # Make requests with very short window
        for i in range(3):
            limiter.is_rate_limited("test_key", max_requests=3, window_seconds=1)

        # Should be at limit
        is_limited, _ = limiter.is_rate_limited("test_key", max_requests=3, window_seconds=1)
        assert is_limited is True

        # Wait for window to expire
        time.sleep(1.1)

        # Should be allowed again
        is_limited, _ = limiter.is_rate_limited("test_key", max_requests=3, window_seconds=1)
        assert is_limited is False

    def test_retry_after_value(self):
        """Test that retry_after value is reasonable."""
        limiter = RateLimiter()

        # Exhaust limit
        for i in range(5):
            limiter.is_rate_limited("test_key", max_requests=5, window_seconds=60)

        # Check retry_after
        is_limited, retry_after = limiter.is_rate_limited("test_key", max_requests=5, window_seconds=60)

        assert is_limited is True
        assert 1 <= retry_after <= 60  # Should be within window
