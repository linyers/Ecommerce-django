from django.urls import path
from .views import GetCartItemsView, AddItemView, RemoveItemView, UpdateItemView, EmptyCartView

app_name = 'cart'

urlpatterns = [
    path('get-items/', GetCartItemsView.as_view()),
    path('add-item/', AddItemView.as_view()),
    path('remove-item/', RemoveItemView.as_view()),
    path('update-item/', UpdateItemView.as_view()),
    path('empty-cart/', EmptyCartView.as_view()),
]
