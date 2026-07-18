import pytest
from django.urls import reverse

from accounts.tests.factories import UserFactory
from contact.admin import ContactMessageAdmin
from contact.models import ContactMessage


@pytest.mark.django_db
class TestContactMessageAdmin:
    def test_satisfaction_display_satisfied(self):
        message = ContactMessage(satisfaction=1)
        assert ContactMessageAdmin.satisfaction_display(None, message) == 'Satisfied'

    def test_satisfaction_display_not_satisfied(self):
        message = ContactMessage(satisfaction=0)
        assert ContactMessageAdmin.satisfaction_display(None, message) == 'Not satisfied'

    def test_satisfaction_display_not_analyzed(self):
        message = ContactMessage(satisfaction=None)
        assert ContactMessageAdmin.satisfaction_display(None, message) == 'Not analyzed'

    def test_superuser_can_access_changelist(self, client):
        admin = UserFactory(is_active=True, is_staff=True, is_superuser=True)
        client.force_login(admin)
        ContactMessage.objects.create(name='Bob', email='bob@example.com', message='Hi')

        response = client.get(reverse('admin:contact_contactmessage_changelist'))

        assert response.status_code == 200

    def test_non_staff_user_is_redirected(self, client):
        user = UserFactory(is_active=True, is_staff=False)
        client.force_login(user)

        response = client.get(reverse('admin:contact_contactmessage_changelist'))

        assert response.status_code == 302

    def test_export_as_csv_action(self, client):
        admin = UserFactory(is_active=True, is_staff=True, is_superuser=True)
        client.force_login(admin)
        message = ContactMessage.objects.create(
            name='Bob', email='bob@example.com', message='Great!', satisfaction=1
        )

        response = client.post(
            reverse('admin:contact_contactmessage_changelist'),
            {'action': 'export_as_csv', '_selected_action': [message.pk]},
        )

        assert response.status_code == 200
        assert response['Content-Type'] == 'text/csv'
        rows = response.content.decode().splitlines()
        assert rows[0] == 'id,name,email,message,created_at,satisfaction'
        assert 'Bob' in rows[1]
