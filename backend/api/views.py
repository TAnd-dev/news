from django.http import Http404
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .models import News, View, Tag
from .serializers import NewsSerializer, NewsCreateSerializer, TagCreateSerializer, TagViewSerializer


class NewsView(generics.RetrieveAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer

    def get(self, request, *args, **kwargs):
        news = self.get_object()
        self.record_view(news)
        return super().get(request, *args, **kwargs)

    def record_view(self, news):
        view = View.objects.create()
        news.views.add(view)


class NewsListView(generics.ListAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    pagination_class = PageNumberPagination


class NewsTagListView(generics.ListAPIView):
    serializer_class = NewsSerializer

    def get_queryset(self):
        return News.objects.filter(tags__slug=self.kwargs.get('tag'))


class NewsCreateView(generics.CreateAPIView):
    serializer_class = NewsCreateSerializer


class NewsDeleteView(generics.DestroyAPIView):
    serializer_class = NewsSerializer
    queryset = News.objects.all()


class LikeDislikeView(generics.UpdateAPIView):
    serializer_class = NewsSerializer
    queryset = News.objects.all()

    def patch(self, request, *args, **kwargs):
        news = self.get_object()
        action = kwargs.get('action')
        if action == 'like':
            news.likes += 1
        elif action == 'dislike':
            news.dislikes += 1
        else:
            raise Http404("Action must be 'like' or 'dislike'")
        news.save()
        serializer = self.get_serializer(news)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TagView(generics.ListAPIView):
    serializer_class = TagViewSerializer
    queryset = Tag.objects.all()
    pagination_class = None


class TagCreateView(generics.CreateAPIView):
    serializer_class = TagCreateSerializer
