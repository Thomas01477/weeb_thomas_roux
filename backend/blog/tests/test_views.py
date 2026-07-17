import pytest
from rest_framework import status
from rest_framework.test import APIClient

from accounts.tests.factories import UserFactory
from blog.models import Article
from blog.tests.factories import ArticleFactory


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def member(api_client):
    user = UserFactory(is_active=True)
    api_client.force_authenticate(user=user)
    return user


@pytest.fixture
def admin(api_client):
    user = UserFactory(is_active=True, is_staff=True)
    api_client.force_authenticate(user=user)
    return user


@pytest.mark.django_db
class TestArticleList:
    def test_list_empty(self, api_client):
        response = api_client.get('/api/articles/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data == []

    def test_list_returns_existing_articles(self, api_client):
        ArticleFactory.create_batch(3)

        response = api_client.get('/api/articles/')

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 3

    def test_create_article(self, api_client, member):
        payload = {
            'title': 'My article',
            'content': 'Some content',
            'author': 'Alice',
        }

        response = api_client.post('/api/articles/', payload)

        assert response.status_code == status.HTTP_201_CREATED
        assert Article.objects.count() == 1
        article = Article.objects.get()
        assert article.title == 'My article'
        assert article.owner == member

    def test_create_article_missing_fields(self, api_client, member):
        response = api_client.post('/api/articles/', {'title': 'Incomplete'})

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_article_anonymous(self, api_client):
        response = api_client.post('/api/articles/', {'title': 'Incomplete'})

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_article_inactive_member(self, api_client):
        user = UserFactory(is_active=False)
        api_client.force_authenticate(user=user)

        response = api_client.post('/api/articles/', {
            'title': 'My article',
            'content': 'Some content',
            'author': 'Alice',
        })

        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestArticleDetail:
    def test_retrieve_article(self, api_client):
        article = ArticleFactory()

        response = api_client.get(f'/api/articles/{article.id}/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == article.title

    def test_retrieve_article_not_found(self, api_client):
        response = api_client.get('/api/articles/999/')

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_own_article(self, api_client, member):
        article = ArticleFactory(title='Old title', owner=member)

        response = api_client.patch(f'/api/articles/{article.id}/', {'title': 'New title'})

        assert response.status_code == status.HTTP_200_OK
        article.refresh_from_db()
        assert article.title == 'New title'

    def test_update_article_invalid_data(self, api_client, member):
        article = ArticleFactory(title='Old title', owner=member)

        response = api_client.patch(f'/api/articles/{article.id}/', {'title': ''})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        article.refresh_from_db()
        assert article.title == 'Old title'

    def test_delete_own_article(self, api_client, member):
        article = ArticleFactory(owner=member)

        response = api_client.delete(f'/api/articles/{article.id}/')

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Article.objects.filter(id=article.id).exists()

    def test_delete_other_members_article(self, api_client, member):
        other_owner = UserFactory(is_active=True)
        article = ArticleFactory(owner=other_owner)

        response = api_client.delete(f'/api/articles/{article.id}/')

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert Article.objects.filter(id=article.id).exists()

    def test_admin_can_delete_any_article(self, api_client, admin):
        owner = UserFactory(is_active=True)
        article = ArticleFactory(owner=owner)

        response = api_client.delete(f'/api/articles/{article.id}/')

        assert response.status_code == status.HTTP_204_NO_CONTENT


@pytest.mark.django_db
class TestMyArticles:
    def test_requires_authentication(self, api_client):
        response = api_client.get('/api/articles/mine/')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_returns_only_own_articles(self, api_client, member):
        ArticleFactory.create_batch(2, owner=member)
        other_owner = UserFactory(is_active=True)
        ArticleFactory(owner=other_owner)

        response = api_client.get('/api/articles/mine/')

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2
        assert all(Article.objects.get(id=item['id']).owner_id == member.id for item in response.data)

    def test_returns_empty_list_when_no_articles(self, api_client, member):
        response = api_client.get('/api/articles/mine/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data == []
