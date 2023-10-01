from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework import pagination
import re

from .models import Product, ProductImage, Category
from .serializers import ProductSerializer, CategorySerializer
from .permissions import IsOwnerOrAdmin
from .pagination import ProductPagination


class CustomViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action == 'retrieve' or self.action == 'list':
            permission_classes = [AllowAny,]
        else:
            permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
        return [permission() for permission in permission_classes]


class ProductViewSet(CustomViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = ProductPagination
    lookup_field = 'slug'
    
    def get_queryset(self):
        params = self.request.query_params

        if not params:
            return super().get_queryset()
        
        DICT_QUERYS = {
            'title__startswith': '',
            'category': '',
            'trending': '',
            'rating': '',
            'sold': '',
            'discount': ''
        }

        for k in DICT_QUERYS.keys():
            if params.get(k) == 'Slick':
                return Product.objects.filter(trending=True).order_by('-stock') if k == 'trending' else Product.objects.order_by(f'-{k}')

        data = {k: params.get(k) for k in DICT_QUERYS.keys() if params.get(k)}

        return Product.objects.filter(**data)


class SearchProductView(APIView):
    def get(self, request, *args, **kwargs):
        query = self.request.query_params.get('title')
        products = Product.objects.values_list('title', flat=True).filter(title__startswith=query)[:6]
        return Response(products)


class CategoryView(APIView):
    def get(self, request, *args, **kwargs):
        queryset = Category.objects.all()
        serializer = CategorySerializer(queryset, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_categories(request):
    data = request.data
    categories = [Category(name=c['name']) for c in data]
    Category.objects.bulk_create(categories)
    return Response({'success': 'created categories'})


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_products(request):
    user = request.user
    data = request.data
    products = []
    for d in data:
        d.pop('images')
        category_data = d.pop('category')
        category = Category.objects.get(name=category_data)
        product = Product(author=user, category=category, **d)
        products.append(product)
    Product.objects.bulk_create(products)
    return Response({'success': 'created products'})


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_products_images(request):
    user = request.user
    data = request.data
    images_data = data.pop('images')
    pattern = r'[a-zA-Z0-9_-]+'
    images = []
    for image in images_data:
        title = ' '.join(re.findall(pattern, str(image).replace('jpg', '')))
        product = Product.objects.filter(title__regex=pattern, title=title)
        if product:
            product = product.first()
            images.append(ProductImage(product=product, image=image))
    ProductImage.objects.bulk_create(images)
    Product.objects.filter(images__image=None).delete()
    return Response({'success': 'created images for products'})