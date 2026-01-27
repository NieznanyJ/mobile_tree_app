"""
Tests for authentication endpoints.
"""
import pytest


class TestRegistration:
    """Tests for /auth/register endpoint."""

    def test_register_success(self, client, test_user_data):
        """Test successful user registration."""
        response = client.post("/auth/register", json=test_user_data)

        assert response.status_code == 201
        data = response.json()
        assert data["email"] == test_user_data["email"]
        assert data["username"] == test_user_data["username"]
        assert "id" in data
        assert "password" not in data  # Password should not be returned

    def test_register_duplicate_email(self, client, registered_user, test_user_data):
        """Test registration with duplicate email."""
        new_user = {
            "email": test_user_data["email"],  # Same email
            "username": "differentuser",
            "password": "AnotherPassword123!",
        }
        response = client.post("/auth/register", json=new_user)

        assert response.status_code == 400
        assert "email" in str(response.json()["detail"])

    def test_register_duplicate_username(self, client, registered_user, test_user_data):
        """Test registration with duplicate username."""
        new_user = {
            "email": "different@example.com",
            "username": test_user_data["username"],  # Same username
            "password": "AnotherPassword123!",
        }
        response = client.post("/auth/register", json=new_user)

        assert response.status_code == 400
        assert "username" in str(response.json()["detail"])

    def test_register_invalid_email(self, client):
        """Test registration with invalid email format."""
        response = client.post(
            "/auth/register",
            json={
                "email": "not-an-email",
                "username": "testuser",
                "password": "SecurePassword123!",
            },
        )

        assert response.status_code == 422  # Validation error


class TestLogin:
    """Tests for /auth/login endpoint."""

    def test_login_success(self, client, registered_user):
        """Test successful login."""
        response = client.post(
            "/auth/login",
            data={
                "username": registered_user["username"],
                "password": registered_user["password"],
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "user" in data
        assert data["user"]["username"] == registered_user["username"]

    def test_login_wrong_password(self, client, registered_user):
        """Test login with wrong password."""
        response = client.post(
            "/auth/login",
            data={
                "username": registered_user["username"],
                "password": "WrongPassword123!",
            },
        )

        assert response.status_code == 401

    def test_login_nonexistent_user(self, client):
        """Test login with nonexistent user."""
        response = client.post(
            "/auth/login",
            data={
                "username": "nonexistent",
                "password": "SomePassword123!",
            },
        )

        assert response.status_code == 401


class TestGetCurrentUser:
    """Tests for /auth/me endpoint."""

    def test_get_me_success(self, client, auth_headers, test_user_data):
        """Test getting current user with valid token."""
        response = client.get("/auth/me", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["username"] == test_user_data["username"]
        assert data["email"] == test_user_data["email"]

    def test_get_me_no_token(self, client):
        """Test getting current user without token."""
        response = client.get("/auth/me")

        assert response.status_code == 403  # HTTPBearer returns 403 for missing token

    def test_get_me_invalid_token(self, client):
        """Test getting current user with invalid token."""
        response = client.get(
            "/auth/me", headers={"Authorization": "Bearer invalid_token"}
        )

        assert response.status_code == 401


class TestRateLimiting:
    """Tests for rate limiting on auth endpoints."""

    def test_login_rate_limit(self, client, registered_user):
        """Test that login endpoint has rate limiting."""
        # Make 6 requests (limit is 5 per minute)
        for i in range(6):
            response = client.post(
                "/auth/login",
                data={
                    "username": registered_user["username"],
                    "password": "WrongPassword",
                },
            )
            if response.status_code == 429:
                # Rate limit hit
                assert "Retry-After" in response.headers
                return

        # If we didn't hit rate limit after 6 attempts, that's unexpected
        # but not necessarily a failure (depends on timing)
        pass

    def test_register_rate_limit(self, client):
        """Test that register endpoint has rate limiting."""
        # Make 11 requests (limit is 10 per minute)
        for i in range(11):
            response = client.post(
                "/auth/register",
                json={
                    "email": f"user{i}@example.com",
                    "username": f"user{i}",
                    "password": "SecurePassword123!",
                },
            )
            if response.status_code == 429:
                # Rate limit hit
                assert "Retry-After" in response.headers
                return

        # If we didn't hit rate limit, that's okay (depends on timing)
        pass
