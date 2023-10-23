from rest_framework import serializers

from .models import Review
from products.models import Product


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        extra_kwargs = {
            'author': {'read_only': True},
            'likes': {'read_only': True},
            'dislikes': {'read_only': True},
        }
    
    def validate(self, attrs):
        user = self.context['request'].user
        product = attrs['product']

        if Product.objects.filter(pk=product, author=user).exists():
            raise serializers.ValidationError({'error': 'You cannot review your own product'})
        
        return super().validate(attrs)