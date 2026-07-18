import pytest
from rest_framework import status
from rest_framework.test import APIClient

from accounts.tests.factories import UserFactory
from contact.models import ContactMessage


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestContactExport:
    def test_export_as_admin(self, api_client):
        ContactMessage.objects.create(
            name='Bob', email='bob@example.com', message='Great!', satisfaction=1
        )
        admin = UserFactory(is_active=True, is_staff=True)
        api_client.force_authenticate(user=admin)

        response = api_client.get('/api/contact/export/')

        assert response.status_code == status.HTTP_200_OK
        assert response['Content-Type'] == 'text/csv'
        content = response.content.decode()
        rows = content.splitlines()
        assert rows[0] == 'id,name,email,message,created_at,satisfaction'
        assert 'Bob' in rows[1]

    def test_export_as_non_admin_member(self, api_client):
        member = UserFactory(is_active=True)
        api_client.force_authenticate(user=member)

        response = api_client.get('/api/contact/export/')

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_export_as_anonymous(self, api_client):
        response = api_client.get('/api/contact/export/')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
