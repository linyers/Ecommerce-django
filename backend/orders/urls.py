from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, CreateRefundView

app_name = 'orders'

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename="order")

urlpatterns = [
    path('', include(router.urls)),
    path('refund/', CreateRefundView.as_view(), name='refund-create'),
]
