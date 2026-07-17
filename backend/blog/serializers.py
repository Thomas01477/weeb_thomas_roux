from rest_framework import serializers

from .models import Article, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ArticleSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=False, allow_null=True
    )
    category_name = serializers.CharField(source='category.name', read_only=True, default=None)

    class Meta:
        model = Article
        fields = [
            'id',
            'title',
            'content',
            'author',
            'owner',
            'category',
            'category_name',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']
