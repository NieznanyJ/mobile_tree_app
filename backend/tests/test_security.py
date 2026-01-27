"""
Tests for security module.
"""
import pytest
from datetime import timedelta

from core.security import (
    create_access_token,
    verify_access_token,
    hash_password,
    verify_password,
)


class TestPasswordHashing:
    """Tests for password hashing functions."""

    def test_hash_password_returns_hash(self):
        """Test that hash_password returns a hash different from input."""
        password = "MySecurePassword123!"
        hashed = hash_password(password)

        assert hashed != password
        assert len(hashed) > 20  # bcrypt hashes are long

    def test_verify_password_correct(self):
        """Test verifying correct password."""
        password = "MySecurePassword123!"
        hashed = hash_password(password)

        assert verify_password(password, hashed) is True

    def test_verify_password_incorrect(self):
        """Test verifying incorrect password."""
        password = "MySecurePassword123!"
        hashed = hash_password(password)

        assert verify_password("WrongPassword!", hashed) is False

    def test_hash_password_different_each_time(self):
        """Test that same password produces different hashes (salting)."""
        password = "MySecurePassword123!"
        hash1 = hash_password(password)
        hash2 = hash_password(password)

        assert hash1 != hash2  # Due to random salt


class TestJWTTokens:
    """Tests for JWT token functions."""

    def test_create_access_token(self):
        """Test creating access token."""
        data = {"sub": "test@example.com"}
        token = create_access_token(data)

        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 50  # JWT tokens are long

    def test_verify_access_token_valid(self):
        """Test verifying valid access token."""
        email = "test@example.com"
        token = create_access_token(data={"sub": email})

        result = verify_access_token(token)

        assert result == email

    def test_verify_access_token_invalid(self):
        """Test verifying invalid access token."""
        result = verify_access_token("invalid.token.here")

        assert result is None

    def test_verify_access_token_tampered(self):
        """Test verifying tampered token."""
        token = create_access_token(data={"sub": "test@example.com"})
        # Tamper with the token
        tampered = token[:-5] + "XXXXX"

        result = verify_access_token(tampered)

        assert result is None

    def test_token_with_custom_expiry(self):
        """Test creating token with custom expiry."""
        token = create_access_token(
            data={"sub": "test@example.com"}, expires_delta=timedelta(hours=2)
        )

        # Token should still be valid
        result = verify_access_token(token)
        assert result == "test@example.com"
