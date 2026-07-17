import pytest
from rest_framework import status
from rest_framework.test import APIClient

from accounts.tests.factories import UserFactory
from blog.models import Article
from blog.tests.factories import ArticleFactory, CategoryFactory


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
        assert response.data['count'] == 0
        assert response.data['results'] == []

    def test_list_returns_existing_articles(self, api_client):
        ArticleFactory.create_batch(3)

        response = api_client.get('/api/articles/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 3
        assert len(response.data['results']) == 3

    def test_list_is_paginated(self, api_client):
        ArticleFactory.create_batch(12)

        first_page = api_client.get('/api/articles/')

        assert first_page.status_code == status.HTTP_200_OK
        assert first_page.data['count'] == 12
        assert len(first_page.data['results']) == 10
        assert first_page.data['next'] is not None

        second_page = api_client.get('/api/articles/?page=2')

        assert len(second_page.data['results']) == 2
        assert second_page.data['next'] is None

    def test_list_filtered_by_author(self, api_client):
        ArticleFactory(author='Alice')
        ArticleFactory(author='Bob')

        response = api_client.get('/api/articles/?author=Alice')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert response.data['results'][0]['author'] == 'Alice'

    def test_list_filtered_by_author_me(self, api_client, member):
        ArticleFactory(owner=member)
        other_owner = UserFactory(is_active=True)
        ArticleFactory(owner=other_owner)

        response = api_client.get('/api/articles/?author=me')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert response.data['results'][0]['owner'] == member.id

    def test_filter_by_author_me_without_auth_returns_all(self, api_client):
        ArticleFactory.create_batch(2)

        response = api_client.get('/api/articles/?author=me')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 2

    def test_list_searched_by_title_or_content(self, api_client):
        ArticleFactory(title='Découvrir Weeb', content='Un article ordinaire.')
        ArticleFactory(title='Autre sujet', content='Parle aussi de weeb ici.')
        ArticleFactory(title='Sans rapport', content='Contenu neutre.')

        response = api_client.get('/api/articles/?search=weeb')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 2

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

    def test_update_other_members_article(self, api_client, member):
        other_owner = UserFactory(is_active=True)
        article = ArticleFactory(title='Old title', owner=other_owner)

        response = api_client.patch(f'/api/articles/{article.id}/', {'title': 'Hacked'})

        assert response.status_code == status.HTTP_403_FORBIDDEN
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


@pytest.mark.django_db
class TestCategoryList:
    def test_list_categories(self, api_client):
        CategoryFactory(name='Tech')
        CategoryFactory(name='Culture')

        response = api_client.get('/api/categories/')

        assert response.status_code == status.HTTP_200_OK
        assert {item['name'] for item in response.data} == {'Tech', 'Culture'}

    def test_list_categories_empty(self, api_client):
        response = api_client.get('/api/categories/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data == []


@pytest.mark.django_db
class TestArticleCategoryFilter:
    def test_filters_articles_by_category(self, api_client):
        tech = CategoryFactory(name='Tech')
        culture = CategoryFactory(name='Culture')
        ArticleFactory(category=tech)
        ArticleFactory(category=culture)

        response = api_client.get(f'/api/articles/?category={tech.id}')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert response.data['results'][0]['category'] == tech.id

    def test_invalid_category_is_ignored(self, api_client):
        ArticleFactory.create_batch(2)

        response = api_client.get('/api/articles/?category=not-a-number')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 2

    def test_article_includes_category_name(self, api_client, member):
        tech = CategoryFactory(name='Tech')

        response = api_client.post('/api/articles/', {
            'title': 'My article',
            'content': 'Some content',
            'author': 'Alice',
            'category': tech.id,
        })

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['category_name'] == 'Tech'

    def test_article_without_category_has_null_category_name(self, api_client):
        ArticleFactory(category=None)

        response = api_client.get('/api/articles/')

        assert response.data['results'][0]['category_name'] is None
