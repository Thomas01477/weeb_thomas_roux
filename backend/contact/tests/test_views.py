from unittest.mock import patch

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from accounts.tests.factories import UserFactory
from contact.models import ContactMessage


@pytest.fixture
def api_client():
    return APIClient()


def _run_in_background_sync(target, *args):
    """Test double for contact.views._run_in_background: runs the target
    immediately instead of in a real thread, so assertions right after the
    POST call can rely on the analysis having already happened."""
    target(*args)


@pytest.mark.django_db
class TestContactList:
    def test_create_message_valid(self, api_client):
        payload = {
            'name': 'Alice',
            'email': 'alice@example.com',
            'message': 'Great service, thanks!',
        }

        with patch('contact.views._run_in_background', side_effect=_run_in_background_sync), \
                patch('contact.ml_utils.predict', return_value=1):
            response = api_client.post('/api/contact/', payload)

        assert response.status_code == status.HTTP_201_CREATED
        assert ContactMessage.objects.count() == 1

    def test_create_message_does_not_block_on_analysis(self, api_client):
        payload = {
            'name': 'Alice',
            'email': 'alice@example.com',
            'message': 'Great service, thanks!',
        }

        with patch('contact.views.threading.Thread') as mock_thread:
            response = api_client.post('/api/contact/', payload)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['satisfaction'] is None
        mock_thread.assert_called_once()
        mock_thread.return_value.start.assert_called_once()

    def test_create_message_runs_sentiment_analysis(self, api_client):
        payload = {
            'name': 'Alice',
            'email': 'alice@example.com',
            'message': 'Great service, thanks!',
        }

        with patch('contact.views._run_in_background', side_effect=_run_in_background_sync), \
                patch('contact.ml_utils.predict', return_value=1) as mock_predict:
            api_client.post('/api/contact/', payload)

        mock_predict.assert_called_once_with('Great service, thanks!')
        message = ContactMessage.objects.get()
        assert message.satisfaction == 1

    def test_create_message_survives_missing_model(self, api_client):
        payload = {
            'name': 'Alice',
            'email': 'alice@example.com',
            'message': 'Great service, thanks!',
        }

        with patch('contact.views._run_in_background', side_effect=_run_in_background_sync), \
                patch('contact.ml_utils.predict', side_effect=FileNotFoundError):
            response = api_client.post('/api/contact/', payload)

        assert response.status_code == status.HTTP_201_CREATED
        message = ContactMessage.objects.get()
        assert message.satisfaction is None

    def test_create_message_reports_analysis_failure_to_sentry(self, api_client):
        payload = {
            'name': 'Alice',
            'email': 'alice@example.com',
            'message': 'Great service, thanks!',
        }
        error = FileNotFoundError('model missing')

        with patch('contact.views._run_in_background', side_effect=_run_in_background_sync), \
                patch('contact.ml_utils.predict', side_effect=error), \
                patch('contact.views.sentry_sdk.capture_exception') as mock_capture:
            api_client.post('/api/contact/', payload)

        mock_capture.assert_called_once_with(error)

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

    def test_list_messages_as_admin(self, api_client):
        ContactMessage.objects.create(
            name='Bob', email='bob@example.com', message='Hello'
        )
        admin = UserFactory(is_active=True, is_staff=True)
        api_client.force_authenticate(user=admin)

        response = api_client.get('/api/contact/')

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1

    def test_list_messages_anonymous(self, api_client):
        response = api_client.get('/api/contact/')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_messages_as_non_admin_member(self, api_client):
        member = UserFactory(is_active=True)
        api_client.force_authenticate(user=member)

        response = api_client.get('/api/contact/')

        assert response.status_code == status.HTTP_403_FORBIDDEN
