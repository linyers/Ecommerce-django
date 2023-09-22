from rest_framework import serializers
from django.db.models import Sum

from .models import Order, Pucharse, Refund, Shipping
from users.models import Address
from products.models import Product
from payment.models import Payment


class ShippingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipping
        fields = '__all__'


class PucharseSerializer(serializers.ModelSerializer):
    product = serializers.IntegerField()

    class Meta:
        model = Pucharse
        fields = '__all__'
        extra_kwargs = {
            'pucharse_date': {'read_only': True},
            'order': {'write_only': True}
        }


class OrderSerializer(serializers.ModelSerializer):
    pucharses = PucharseSerializer(many=True)
    shipping_address_upload = serializers.IntegerField(write_only=True)
    shipping_upload = serializers.IntegerField(write_only=True)

    class Meta:
        model = Order

        fields = ('costumer',
                'order_code',
                'start_date',
                'end_date',
                'shipping',
                'shipping_address',
                'order_status',
                'payment',
                'pucharses',
                'shipping_address_upload',
                'shipping_upload')
        
        extra_kwargs = {
            'shipping': {'read_only': True},
            'shipping_address': {'read_only': True},
            'payment': {'read_only': True},
            'order_code': {'read_only': True},
            'costumer': {'read_only': True}
        }

    def create(self, validated_data):
        validated_data.pop('shipping_upload')
        pucharses_data = validated_data.pop('pucharses')
        shipping_address_data = validated_data.pop('shipping_address_upload')

        shipping_address = Address.objects.get(id=shipping_address_data)
        costumer = shipping_address.user

        order = Order.objects.create(costumer=costumer, shipping_address=shipping_address, **validated_data)
        pucharses = list()
        for pucharse in pucharses_data:
            product = Product.objects.get(id=pucharse['product'])
            pucharses.append(Pucharse(product=product, order=order, **pucharse))
        Pucharse.objects.bulk_create(pucharses)

        return order

    def update(self, instance, validated_data):
        shipping_data = validated_data.pop('shipping_upload')
        shipping = Shipping.objects.get(id=shipping_data)
        instance.shipping = shipping
        
        instance.order_status = validated_data.pop('order_status')
        instance.save()
        return instance


class RefundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refund
        fields = '__all__'