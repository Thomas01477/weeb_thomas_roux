import factory

from blog.models import Article


class ArticleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Article

    title = factory.Sequence(lambda n: f'Article {n}')
    content = factory.Faker('paragraph')
    author = factory.Faker('name')
