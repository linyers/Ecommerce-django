from django.urls import path
from .views import ReviewsAPIView, ReviewLikeAPIView, ReviewDislikeAPIView

app_name = 'reviews'

urlpatterns = [
    path('', ReviewsAPIView.as_view()),
    path('like/', ReviewLikeAPIView.as_view()),
    path('dislike/', ReviewDislikeAPIView.as_view()),
]
