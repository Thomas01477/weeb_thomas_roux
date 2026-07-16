import pytest
from rest_framework import status
from rest_framework.test import APIClient

from contact.models import ContactMessage


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestContactList:
    def test_create_message_valid(self, api_client):
        payload = {
            'name': 'Alice',
            'email': 'alice@example.com',
            'message': 'Great service, thanks!',
        }

        response = api_client.post('/api/contact/', payload)

        assert response.status_code == status.HTTP_201_CREATED
        assert ContactMessage.objects.count() == 1
        message = ContactMessage.objects.get()
        assert message.satisfaction is None

    def test_create_message_missing_email(self, api_client):
        payload = {
            'name': 'Alice',
            'message': 'Great service, thanks!',
        }

        response = api_client.post('/api/contact/', payload)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert ContactMessage.objects.count() == 0

    def test_create_message_invalid_email(self, api_client):
        payload = {
            'name': 'Alice',
            'email': 'not-an-email',
            'message': 'Great service, thanks!',
        }

        response = api_client.post('/api/contact/', payload)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert ContactMessage.objects.count() == 0

    def test_list_messages(self, api_client):
        ContactMessage.objects.create(
            name='Bob', email='bob@example.com', message='Hello'
        )

        response = api_client.get('/api/contact/')

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
