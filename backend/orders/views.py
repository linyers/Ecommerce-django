from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Order, Refund
from .permissions import IsOwnerOrDeliverer
from .serializer import OrderSerializer, OrderUpdateSerializer, RefundSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrDeliverer]

    def list(self, request, *args, **kwargs):
        params = request.query_params
        user = request.user

        if params.get('deliverer') and user.is_deliverer:
            queryset = Order.objects.all().waiting_shipping()
        else:
            queryset = Order.objects.all().filter(costumer=user)
        serializer = OrderSerializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = OrderUpdateSerializer(instance, request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateRefundView(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user
        data = {**request.data}
        serializer = RefundSerializer(data=data)
        if serializer.is_valid():
            data = serializer.data
            data['costumer'] = user
            data['order'] = Order.objects.get(id=data.pop('order'))
            refund = Refund.objects.create(**data)
            refund.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)