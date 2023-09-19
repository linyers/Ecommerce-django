from rest_framework import viewsets
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.utils.text import slugify

from .models import Product, ProductImage, Category
from .serializers import ProductSerializer, ProductImageSerializer, CategorySerializer
from .permissions import IsOwnerOrAdmin
from .pagination import ProductPagination


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = ProductPagination
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action == 'retrieve' or self.action == 'list':
            permission_classes = [AllowAny,]
        else:
            permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
        return [permission() for permission in permission_classes]
    
    def list(self, request, *args, **kwargs):
        queryset = Product.objects.all()
        serializer = ProductSerializer(queryset, many=True)
        data = serializer.data
        return Response(data=data)
    
    def get_queryset(self):
        params = self.request.query_params

        if not params:
            return super().get_queryset()
        
        DICT_QUERYS = {
            'category': '',
            'trending': '',
            'rating': '',
            'discount': ''
        }

        data = {k: params.get(k) for k in DICT_QUERYS.keys() if params.get(k)}

        return Product.objects.filter(**data)


class CategoryView(APIView):
    def get(self, request, *args, **kwargs):
        queryset = Category.objects.all()
        serializer = CategorySerializer(queryset, many=True)
        return Response(serializer.data)