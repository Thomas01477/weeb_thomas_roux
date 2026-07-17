from django.contrib import admin

from .models import Article, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'owner', 'category', 'created_at', 'updated_at')
    list_filter = ('author', 'category')
    search_fields = ('title', 'content', 'author')
