from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Order
from .permissions import IsOwnerOrDeliverer
from .serializer import OrderSerializer

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