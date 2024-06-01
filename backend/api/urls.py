from django.urls import path

from .views import NewsView, NewsCreateView, NewsListView, NewsDeleteView, NewsTagListView, LikeDislikeView, \
    TagCreateView, TagView

urlpatterns = [
    path('news/', NewsListView.as_view()),
    path('tags/', TagView.as_view()),
    path('news/tag/<str:tag>', NewsTagListView.as_view()),
    path('news/<str:pk>/', NewsView.as_view()),
    path('news/<str:pk>/delete_news', NewsDeleteView.as_view()),
    path('news/<str:pk>/<str:action>', LikeDislikeView.as_view()),
    path('news/<str:pk>/<str:action>', LikeDislikeView.as_view()),
    path('news/create_news', NewsCreateView.as_view()),
    path('news/create_tag', TagCreateView.as_view())
]

