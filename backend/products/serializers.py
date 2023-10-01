from rest_framework import serializers

from .models import Product, Category, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name',)


class ProductSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(read_only=True)
    category = serializers.CharField(max_length=150, required=True)
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