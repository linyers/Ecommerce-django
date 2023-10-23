from rest_framework import serializers

from .models import Order, Purchase, Refund, Shipping
from users.models import Address
from products.serializers import ProductSerializer
from payment.serializers import PaymentSerializer, Payment


class ShippingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipping
        fields = '__all__'
        extra_kwargs = {
            'deliverer': {'read_only': True},
        }


class purchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = '__all__'
        extra_kwargs = {
            'purchase_date': {'read_only': True},
            'order': {'write_only': True}
        }
    
    def to_representation(self, instance):
            data = super().to_representation(instance)
            data["product"] = ProductSerializer(instance.product).data
            return data


class OrderSerializer(serializers.ModelSerializer):
    purchases = purchaseSerializer(many=True)
    from_address_upload = serializers.IntegerField(write_only=True, allow_null=True)
    to_address_upload = serializers.IntegerField(write_only=True, allow_null=True)
    shipping = ShippingSerializer(default=None, allow_null=True)
    payment = PaymentSerializer()

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
                'purchases',
                'from_address_upload',
                'to_address_upload',)
        
        extra_kwargs = {
            'from_address': {'read_only': True},
            'to_address': {'read_only': True},
            'order_code': {'read_only': True},
            'costumer': {'read_only': True}
        }
    
    def validate(self, attrs):
        purchases_data = attrs.get('purchases')
        for purchase in purchases_data:
            if purchase['quantity'] > purchase['product'].stock:
                raise serializers.ValidationError({'product': 'Quantity out of range of product stock.'})
        
        if not attrs.get('with_shipping'):
            return attrs
        
        to_address = attrs.get('to_address_upload')
        ## Validate if to address is an address of user in context or is an address that does not correspond to a user 
        if not Address.objects.filter(id=to_address, user=self.context['request'].user).exists() and not Address.objects.filter(id=to_address, user=None).exists():
            raise serializers.ValidationError({'to_address': 'Enter a valid address to receive shipping'})
        
        return attrs

    def create(self, validated_data):
        shipping_data = validated_data.pop('shipping')
        purchases_data = validated_data.pop('purchases')
        from_address_data = validated_data.pop('from_address_upload')
        to_address_data = validated_data.pop('to_address_upload')
        payment_data = validated_data.pop('payment')

        if len([p for p in purchases_data if p['product'].author == purchases_data[0]['product'].author]) == len(purchases_data) and not from_address_data:
            # If all products are from the same author and no address is provided, use the author's address
            from_address = Address.objects.get(user=purchases_data[0]['product'].author, default=True)
        else:
            # TODO: implement a way to obtain the closest email address to sellers
            from_address = Address.objects.get(id=13)
        
        to_address = Address.objects.get(id=to_address_data) if to_address_data else None
        shipping = Shipping.objects.create(**shipping_data) if shipping_data else None

        costumer = self.context['request'].user

        payment = Payment.objects.create(user=costumer, **payment_data)

        order = Order.objects.create(costumer=costumer,
                                    from_address=from_address,
                                    to_address=to_address, 
                                    shipping=shipping,
                                    payment=payment,
                                    order_status='on_the_way',
                                    **validated_data)
        purchases = list()
        for purchase in purchases_data:
            purchases.append(Purchase(order=order, **purchase))
        Purchase.objects.bulk_create(purchases)

        return order


class OrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('order_status',)


class RefundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refund
        fields = '__all__'
        extra_kwargs = {'costumer': {'read_only': True}}