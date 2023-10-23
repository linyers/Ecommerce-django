from django.urls import path
from .views import GetWishlist, AddWishlistItem, RemoveWishlistItem

app_name = 'wishlist'

urlpatterns = [
    path('get-items/', GetWishlist.as_view()),
    path('add-item/', AddWishlistItem.as_view()),
    path('remove-item/', RemoveWishlistItem.as_view())
]
