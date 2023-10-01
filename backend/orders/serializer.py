from rest_framework import serializers

from .models import Order, Pucharse, Refund, Shipping
from users.models import Address
from products.models import Product
from payment.models import Payment


class ShippingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipping
        fields = '__all__'
        extra_kwargs = {
            'deliverer': {'read_only': True},
        }


class PucharseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pucharse
        fields = '__all__'
        extra_kwargs = {
            'pucharse_date': {'read_only': True},
            'order': {'write_only': True}
        }


class OrderSerializer(serializers.ModelSerializer):
    pucharses = PucharseSerializer(many=True)
    from_address_upload = serializers.IntegerField(write_only=True, allow_null=True)
    to_address_upload = serializers.IntegerField(write_only=True, allow_null=True)
    shipping = ShippingSerializer(default=None)

    class Meta:
        model = Order

        fields = ('id',
                'costumer',
                'order_code',
                'start_date',
                'end_date',
                'with_shipping',
                'shipping',
                'from_address',
                'to_address',
                'order_status',
                'payment',
                'pucharses',
                'from_address_upload',
                'to_address_upload',)
        
        extra_kwargs = {
            'from_address': {'read_only': True},
            'to_address': {'read_only': True},
            'payment': {'read_only': True},
            'order_code': {'read_only': True},
            'costumer': {'read_only': True}
        }

    def validate(self, attrs):
        pucharses_data = attrs.get('pucharses')
        for pucharse in pucharses_data:
            if pucharse['quantity'] > pucharse['product'].stock:
                raise serializers.ValidationError({'product': 'Quantity out of range of product stock.'})
        return attrs

    def create(self, validated_data):
        shipping_data = validated_data.pop('shipping')
        pucharses_data = validated_data.pop('pucharses')
        from_address_data = validated_data.pop('from_address_upload')
        to_address_data = validated_data.pop('to_address_upload')

        from_address = \
            Address.objects.get(id=from_address_data) if from_address_data else None
        to_address = \
            Address.objects.get(id=to_address_data) if to_address_data else None

        costumer = self.context['request'].user

        order = Order.objects.create(costumer=costumer,
                                    from_address=from_address,
                                    to_address=to_address, 
                                    **validated_data)
        pucharses = list()
        for pucharse in pucharses_data:
            pucharses.append(Pucharse(order=order, **pucharse))
        Pucharse.objects.bulk_create(pucharses)

        return order

    def update(self, instance, validated_data):
        user = self.context['request'].user
        if user.is_deliverer:
            from_address_data = validated_data.pop('from_address_upload')
            from_address = Address.objects.get(id=from_address_data)
            instance.from_address = from_address

            shipping_data = validated_data.pop('shipping', None)
            shipping = Shipping.objects.create(deliverer=user, **shipping_data)
            instance.shipping = shipping
        
        instance.order_status = validated_data.pop('order_status')
        instance.save()
        return instance


class RefundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refund
        fields = '__all__'