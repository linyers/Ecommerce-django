from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()

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

        if attrs['rate'] not in range(1, 6):
            raise serializers.ValidationError({'error': 'Rate must be between 1 and 5'})
        
        if product.author == user:
            raise serializers.ValidationError({'error': 'You cannot review your own product'})
        
        if not user.order.filter(purchases__product__id=product.id, order_status='delivered').exists():
            raise serializers.ValidationError({'error': 'You cannot review a product you have not purchased'})
        
        if Review.objects.filter(author=user, product=product).exists() and self.context['request'].method == 'POST':
            raise serializers.ValidationError({'error': 'You have already reviewed this product'})
        
        return super().validate(attrs)