import pytest
from django.urls import reverse

from accounts.tests.factories import UserFactory
from blog.tests.factories import ArticleFactory


@pytest.mark.django_db
class TestArticleAdmin:
    def test_superuser_can_access_changelist(self, client):
        admin = UserFactory(is_active=True, is_staff=True, is_superuser=True)
        client.force_login(admin)
        ArticleFactory()

        response = client.get(reverse('admin:blog_article_changelist'))

        assert response.status_code == 200

    def test_non_staff_user_is_redirected(self, client):
        user = UserFactory(is_active=True, is_staff=False)
        client.force_login(user)

        response = client.get(reverse('admin:blog_article_changelist'))

        assert response.status_code == 302
