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

    def test_register_with_missing_name_fields(self, api_client):
        payload = {
            'email': 'bob@example.com',
            'password': 'strongpass123',
        }

        response = api_client.post('/api/auth/register/', payload)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'first_name' in response.data
        assert 'last_name' in response.data


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
        user = UserFactory(email='dave@example.com', is_active=True)

        response = api_client.post(
            '/api/auth/login/', {'email': 'dave@example.com', 'password': 'pass1234'}
        )

        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert response.data['user']['id'] == user.id


@pytest.mark.django_db
class TestProfile:
    def test_get_profile_without_auth(self, api_client):
        response = api_client.get('/api/auth/profile/')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_profile_with_auth(self, api_client):
        user = UserFactory(email='erin@example.com', first_name='Erin')
        api_client.force_authenticate(user=user)

        response = api_client.get('/api/auth/profile/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == 'erin@example.com'
        assert response.data['first_name'] == 'Erin'

    def test_patch_profile_updates_fields(self, api_client):
        user = UserFactory(email='frank@example.com', first_name='Frank')
        api_client.force_authenticate(user=user)

        response = api_client.patch(
            '/api/auth/profile/',
            {'first_name': 'Franklin', 'last_name': 'Doe', 'email': 'franklin@example.com'},
        )

        assert response.status_code == status.HTTP_200_OK
        user.refresh_from_db()
        assert user.first_name == 'Franklin'
        assert user.last_name == 'Doe'
        assert user.email == 'franklin@example.com'

    def test_patch_profile_with_existing_email(self, api_client):
        UserFactory(email='taken@example.com')
        user = UserFactory(email='grace@example.com')
        api_client.force_authenticate(user=user)

        response = api_client.patch('/api/auth/profile/', {'email': 'taken@example.com'})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        user.refresh_from_db()
        assert user.email == 'grace@example.com'

    def test_patch_profile_without_auth(self, api_client):
        response = api_client.patch('/api/auth/profile/', {'first_name': 'Nope'})

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
