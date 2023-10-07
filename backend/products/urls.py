from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryView, create_categories, create_products, create_products_images, SearchProductView, FiltersProducts

app_name = 'products'

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename="product")

urlpatterns = [
    path('', include(router.urls)),
    path('search-products/', SearchProductView.as_view(), name="search-products"),
    path('filters-products/', FiltersProducts.as_view(), name="filters-products"),
    path("categories/", CategoryView.as_view(), name="categories"),
    path("bulk-create/categories/",create_categories, name="bulk_create_categories"),
    path("bulk-create/products/", create_products, name="bulk_create_products"),
    path("bulk-create/images/", create_products_images, name="bulk_create_images"),
]
