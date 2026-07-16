import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
class TestCustomUser:
    def test_create_user_is_inactive_by_default(self):
        user = User.objects.create_user(username='alice', email='alice@example.com', password='pass1234')

        assert user.is_active is False

    def test_create_superuser_is_active_and_staff(self):
        superuser = User.objects.create_superuser(
            username='admin', email='admin@example.com', password='pass1234'
        )

        assert superuser.is_active is True
        assert superuser.is_staff is True
