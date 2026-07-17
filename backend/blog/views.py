from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotAuthenticated, PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Article
from .serializers import ArticleSerializer


def _require_active_member(request):
    if not request.user.is_authenticated:
        raise NotAuthenticated()
    if not request.user.is_active:
        raise PermissionDenied('Only active members can perform this action.')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_articles(request):
    articles = Article.objects.filter(owner=request.user).order_by('-created_at')
    serializer = ArticleSerializer(articles, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def article_list(request):
    if request.method == 'GET':
        articles = Article.objects.all().order_by('-created_at')
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data)

    _require_active_member(request)

    serializer = ArticleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(owner=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
def article_detail(request, pk):
    article = get_object_or_404(Article, pk=pk)

    if request.method == 'GET':
        serializer = ArticleSerializer(article)
        return Response(serializer.data)

    _require_active_member(request)
    if not request.user.is_staff and article.owner_id != request.user.id:
        raise PermissionDenied('You can only modify your own articles.')

    if request.method == 'PATCH':
        serializer = ArticleSerializer(article, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    article.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
