from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Cart, CartItem
from products.models import Product
from products.serializers import ProductSerializer


class GetCartItemsView(APIView):
    def get(self, request):
        user = request.user
        cart = Cart.objects.get(user=user)

        data = list()
        price = 0

        if CartItem.objects.filter(cart=cart).exists():
            cart_items = CartItem.objects.filter(cart=cart)

            for item in cart_items:
                product = Product.objects.get(id=item.product.id)
                price += product.price * item.count
                total_price_item = product.price * item.count
                product = ProductSerializer(product)

                data.append(
                    {
                        'id': item.id,
                        'product': product.data,
                        'count': item.count,
                        'total_price_item': total_price_item
                    }
                )

        return Response({'cart': data, 'total_items': cart.total_items, 'total_price': price}, status=status.HTTP_200_OK)


class AddItemView(APIView):
    def post(self, request):
        user = request.user
        data = request.data

        try:
            product_id = int(data['product_id'])
            product_quantity = int(data['product_quantity'])
        except:
            return Response(
                {'error': 'Enter a valid integer'},
                status=status.HTTP_404_NOT_FOUND)
        
        if not Product.objects.filter(id=product_id).exists():
                return Response(
                    {'error': 'Product does not exist'},
                    status=status.HTTP_404_NOT_FOUND)
        
        product = Product.objects.get(id=product_id)
        cart = Cart.objects.get(user=user)

        if product_quantity > product.stock or product_quantity <= 0:
            return Response({'error': 'Quantity is out of range'},
                            status=status.HTTP_400_BAD_REQUEST)

        if CartItem.objects.filter(cart=cart, product=product).exists():
                return Response(
                    {'error': 'Item is already in cart'},
                    status=status.HTTP_400_BAD_REQUEST)
        
        CartItem.objects.create(cart=cart,
                                product=product,
                                count=product_quantity)
        cart.total_items += product_quantity
        cart.save()

        data_response = list()

        cart_items = CartItem.objects.filter(cart=cart)
        for item in cart_items:
            product = Product.objects.get(id=item.product.id)
            product = ProductSerializer(product)

            data_response.append(
                {
                    'id': item.id,
                    'product': product.data,
                    'count': item.count,
                }
            )
        return Response({'cart': data_response, 'total_items': cart.total_items}, status=status.HTTP_201_CREATED)


class RemoveItemView(APIView):
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
        
        product = Product.objects.get(id=product_id)
        cart = Cart.objects.get(user=user)

        if not CartItem.objects.filter(cart=cart, product=product).exists():
                return Response(
                    {'error': 'Item is not in the cart'},
                    status=status.HTTP_400_BAD_REQUEST)
        
        cart_item = CartItem.objects.get(cart=cart, product=product)
        cart.total_items -= cart_item.count
        cart.save()
        cart_item.delete()

        data_response = list()

        cart_items = CartItem.objects.filter(cart=cart)
        for item in cart_items:
            product = Product.objects.get(id=item.product.id)
            product = ProductSerializer(product)

            data_response.append(
                {
                    'id': item.id,
                    'product': product.data,
                    'count': item.count,
                }
            )
        return Response({'cart': data_response, 'total_items': cart.total_items}, status=status.HTTP_200_OK)


class UpdateItemView(APIView):
    def put(self, request):
        user = request.user
        data = request.data

        try:
            product_id = int(data['product_id'])
            product_quantity = int(data['product_quantity'])
        except:
            return Response(
                {'error': 'Enter a valid integer'},
                status=status.HTTP_404_NOT_FOUND)
        
        if not Product.objects.filter(id=product_id).exists():
                return Response(
                    {'error': 'Product does not exist'},
                    status=status.HTTP_404_NOT_FOUND)
        
        product = Product.objects.get(id=product_id)
        cart = Cart.objects.get(user=user)

        if not CartItem.objects.filter(cart=cart, product=product).exists():
                return Response(
                    {'error': 'Item is not in the cart'},
                    status=status.HTTP_400_BAD_REQUEST)
        
        if product_quantity > product.stock or product_quantity <= 0:
            return Response({'error': 'Quantity is out of range'},
                            status=status.HTTP_400_BAD_REQUEST)
        
        cart_item = CartItem.objects.get(cart=cart, product=product)
        cart.total_items -= cart_item.count
        cart_item.count = product_quantity
        cart.total_items += product_quantity
        cart_item.save()
        cart.save()

        data_response = list()

        cart_items = CartItem.objects.filter(cart=cart)
        for item in cart_items:
            product = Product.objects.get(id=item.product.id)
            product = ProductSerializer(product)

            data_response.append(
                {
                    'id': item.id,
                    'product': product.data,
                    'count': item.count,
                }
            )
        return Response({'cart': data_response, 'total_items': cart.total_items}, status=status.HTTP_200_OK)


class EmptyCartView(APIView):
    def delete(self, request):
        user = request.user

        cart = Cart.objects.get(user=user)

        if not CartItem.objects.filter(cart=cart).exists():
            return Response(
                {'success': 'Cart is already empty'},
                status=status.HTTP_200_OK)

        CartItem.objects.filter(cart=cart).delete()
        cart.total_items = 0
        cart.save()
        
        return Response(
            {'success': 'Cart emptied successfully'},
            status=status.HTTP_200_OK)
