from django.urls import path

from . import views

urlpatterns = [
    path('articles/', views.article_list, name='article-list'),
    path('articles/mine/', views.my_articles, name='article-mine'),
    path('articles/<int:pk>/', views.article_detail, name='article-detail'),
]
