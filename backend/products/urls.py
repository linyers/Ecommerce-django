from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryView

app_name = 'products'

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename="product")

urlpatterns = [
    path('', include(router.urls)),
    path("categories/", CategoryView.as_view(), name="categories"),
]
