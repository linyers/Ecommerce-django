from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserView, AddressViewSet, MyTokenObtainPairView, SignupAPIView, ChangePasswordView, ChangePasswordEmailView, activate, TokenRefreshView

app_name = 'users'

router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename="address")

urlpatterns = [
    path("user/", UserView.as_view(), name="user"),
    path("user/",  include(router.urls)),
    path("login/", MyTokenObtainPairView.as_view(), name="login"),
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('token-refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('change-password/', ChangePasswordEmailView.as_view(), name='change_password_email'),
    path('change-password/<uidb64>/<token>', ChangePasswordView.as_view(), name='change_password'),
    path('activate/<uidb64>/<token>', activate, name='activate'),
]
