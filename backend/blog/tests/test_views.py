import pytest
from rest_framework import status
from rest_framework.test import APIClient

from blog.models import Article
from blog.tests.factories import ArticleFactory


@pytest.fixture
def api_client():
    return APIClient()


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

    def test_create_article(self, api_client):
        payload = {
            'title': 'My article',
            'content': 'Some content',
            'author': 'Alice',
        }

        response = api_client.post('/api/articles/', payload)

        assert response.status_code == status.HTTP_201_CREATED
        assert Article.objects.count() == 1
        assert Article.objects.get().title == 'My article'

    def test_create_article_missing_fields(self, api_client):
        response = api_client.post('/api/articles/', {'title': 'Incomplete'})

        assert response.status_code == status.HTTP_400_BAD_REQUEST


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

    def test_update_article(self, api_client):
        article = ArticleFactory(title='Old title')

        response = api_client.patch(f'/api/articles/{article.id}/', {'title': 'New title'})

        assert response.status_code == status.HTTP_200_OK
        article.refresh_from_db()
        assert article.title == 'New title'

    def test_update_article_invalid_data(self, api_client):
        article = ArticleFactory(title='Old title')

        response = api_client.patch(f'/api/articles/{article.id}/', {'title': ''})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        article.refresh_from_db()
        assert article.title == 'Old title'

    def test_delete_article(self, api_client):
        article = ArticleFactory()

        response = api_client.delete(f'/api/articles/{article.id}/')

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Article.objects.filter(id=article.id).exists()
