from rest_framework import serializers
from django.core.validators import MinValueValidator, MaxValueValidator
from rest_framework.fields import empty

from .models import Product, Category, ProductImage
from users.models import Address

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name',)


class ProductSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    category = serializers.CharField(max_length=150, required=True)
    discount = serializers.IntegerField(validators=[MinValueValidator(1),  MaxValueValidator(100)], required=False)
    images = serializers.StringRelatedField(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child = serializers.ImageField(max_length = 1000000, allow_empty_file = False, use_url = False),
        write_only = True,
        required = True,
        max_length = 5
    )

    class Meta:
        model = Product
        fields = ('id',
                'title',
                'slug',
                'description', 
                'category',
                'price',
                'discount', 
                'stock',
                'sold',
                'used',
                'created_at',
                'updated_at',
                'author',
                'rating',
                'images',
                'uploaded_images')
        
        extra_kwargs = {
            'slug': {'read_only': True},
            'sold': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'rating': {'read_only': True},
        }

    def validate(self, attrs):
        user = self.context['request'].user
        if not user.dni or not user.phone or not user.first_name or not user.last_name:
            raise serializers.ValidationError({'user': 'Complete your profile'})

        if not Address.objects.filter(user=user, default=True).exists():
            raise serializers.ValidationError({'address': 'Add a default address'})
        
        if len(attrs.get('description')) < 30:
            raise serializers.ValidationError({'description': 'Description short, must have at least 30 characters'})
        
        if len(attrs.get('uploaded_images')) > 5:
            raise serializers.ValidationError({'uploaded_images': 'You can only upload 5 images max'})
        
        try:
            category_name = attrs.get('category')
            category = Category.objects.get(name=category_name)
        except:
            raise serializers.ValidationError({'category': 'Enter a valid value'})
        
        return super().validate(attrs)

    def create(self, validated_data):
        author = self.context['request'].user
        upload_images = validated_data.pop('uploaded_images')
        category_name = validated_data.pop('category')

        category = Category.objects.get(name=category_name)
        product = Product.objects.create(author=author, category=category, **validated_data)
        images = [ProductImage(product=product, image=image) for image in upload_images]
        ProductImage.objects.bulk_create(images)
        
        return product
    
    def update(self, instance, validated_data):
        category_name = validated_data.pop('category')
        category = Category.objects.get(name=category_name)
        instance.category = category

        ProductImage.objects.filter(product=instance).delete()
        uploaded_images = validated_data.pop('uploaded_images')
        images = [ProductImage(product=instance, image=image) for image in uploaded_images]
        ProductImage.objects.bulk_create(images)
        
        instance = super().update(instance, validated_data)
        return instance