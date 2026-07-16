import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

from accounts.tests.factories import UserFactory

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestRegister:
    def test_register_with_valid_data(self, api_client):
        payload = {
            'first_name': 'Alice',
            'last_name': 'Doe',
            'email': 'alice@example.com',
            'password': 'strongpass123',
        }

        response = api_client.post('/api/auth/register/', payload)

        assert response.status_code == status.HTTP_201_CREATED
        user = User.objects.get(email='alice@example.com')
        assert user.is_active is False

    def test_register_with_existing_email(self, api_client):
        UserFactory(email='alice@example.com')

        payload = {
            'first_name': 'Alice',
            'last_name': 'Doe',
            'email': 'alice@example.com',
            'password': 'strongpass123',
        }

        response = api_client.post('/api/auth/register/', payload)

        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestLogin:
    def test_login_with_inactive_account(self, api_client):
        UserFactory(email='bob@example.com', is_active=False)

        response = api_client.post(
            '/api/auth/login/', {'email': 'bob@example.com', 'password': 'pass1234'}
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_login_with_wrong_password(self, api_client):
        UserFactory(email='carol@example.com', is_active=True)

        response = api_client.post(
            '/api/auth/login/', {'email': 'carol@example.com', 'password': 'wrongpass'}
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_with_active_account(self, api_client):
        UserFactory(email='dave@example.com', is_active=True)

        response = api_client.post(
            '/api/auth/login/', {'email': 'dave@example.com', 'password': 'pass1234'}
        )

        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
