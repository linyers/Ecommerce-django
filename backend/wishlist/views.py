from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Wishlist, WishlistProduct
from products.serializers import Product, ProductSerializer


class GetWishlist(APIView):
    permission_classes = [IsAuthenticated,]

    def get(self, request):
        user = self.request.user
        wishlist = Wishlist.objects.get(user=user)

        data = list()

        if WishlistProduct.objects.filter(wishlist=wishlist).exists():
            wishlist_products = WishlistProduct.objects.filter(wishlist=wishlist)

            for item in wishlist_products:
                product = Product.objects.get(id=item.product.id)
                product = ProductSerializer(product)

                data.append(
                    {
                        'id': item.id,
                        'product': product.data,
                    }
                )
        return Response({'wishlist': data}, status=status.HTTP_200_OK)


class AddWishlistItem(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request):
        user = request.user
        data = request.data

        try:
            product_id = int(data['product_id'])
        except:
            return Response(
                {'error': 'Enter a valid integer'},
                status=status.HTTP_404_NOT_FOUND)
        
        if not Product.objects.filter(id=product_id).exists():
            return Response(
                {'error': 'Product does not exist'},
                status=status.HTTP_404_NOT_FOUND)
        
        product = Product.objects.get(id=product_id)
        wishlist = Wishlist.objects.get(user=user)

        if WishlistProduct.objects.filter(product=product, wishlist=wishlist).exists():
            return Response(
                {'error': 'Product already exists in wishlist'},
                status=status.HTTP_404_NOT_FOUND)
        
        WishlistProduct.objects.create(product=product, wishlist=wishlist)

        data_response = list()

        wishlist_products = WishlistProduct.objects.filter(wishlist=wishlist)
        for item in wishlist_products:
            product = Product.objects.get(id=item.product.id)
            product = ProductSerializer(product)

            data_response.append(
                {
                    'id': item.id,
                    'product': product.data,
                }
            )
            
        return Response({'wishlist': data_response}, status=status.HTTP_200_OK)


class RemoveWishlistItem(APIView):
    permission_classes = [IsAuthenticated,]

    def delete(self, request):
        user = request.user
        data = request.data

        try:
            product_id = int(data['product_id'])
        except:
            return Response(
                {'error': 'Enter a valid integer'},
                status=status.HTTP_404_NOT_FOUND)
        
        if not Product.objects.filter(id=product_id).exists():
            return Response(
                {'error': 'Product does not exist'},
                status=status.HTTP_404_NOT_FOUND)
        
        wishlist = Wishlist.objects.get(user=user)
        product = Product.objects.get(id=product_id)

        if not WishlistProduct.objects.filter(wishlist=wishlist, product=product).exists():
            return Response(
                {'error': 'Product does not exist in wishlist'},
                status=status.HTTP_404_NOT_FOUND)
        
        WishlistProduct.objects.get(wishlist=wishlist, product=product).delete()

        data_response = list()

        wishlist_products = WishlistProduct.objects.filter(wishlist=wishlist)
        for item in wishlist_products:
            product = Product.objects.get(id=item.product.id)
            product = ProductSerializer(product)

            data_response.append(
                {
                    'id': item.id,
                    'product': product.data,
                }
            )
            
        return Response({'wishlist': data_response}, status=status.HTTP_200_OK)