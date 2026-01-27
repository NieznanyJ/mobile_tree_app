"""
Pytest configuration and fixtures for backend tests.
"""
import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Set test environment before importing app modules
os.environ["SECRET_KEY"] = "test_secret_key_for_testing_only_32chars!"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["CORS_ORIGINS"] = "http://localhost:3000"

from db.database import Base, get_db
from main import app


# Create test database engine (in-memory SQLite)
engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for tests."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with fresh database."""
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def test_user_data():
    """Sample user data for registration."""
    return {
        "email": "test@example.com",
        "username": "testuser",
        "password": "SecurePassword123!",
    }


@pytest.fixture
def registered_user(client, test_user_data):
    """Register a user and return their data."""
    response = client.post("/auth/register", json=test_user_data)
    assert response.status_code == 201
    return test_user_data


@pytest.fixture
def auth_token(client, registered_user):
    """Get authentication token for registered user."""
    response = client.post(
        "/auth/login",
        data={
            "username": registered_user["username"],
            "password": registered_user["password"],
        },
    )
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture
def auth_headers(auth_token):
    """Headers with authentication token."""
    return {"Authorization": f"Bearer {auth_token}"}
