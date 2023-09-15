from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.utils import timezone
from django.db.models.signals import pre_save
import uuid

User = get_user_model()


def product_img_path(instance, filename):
    return f'/products/{filename}'


class Category(models.Model):
    name = models.CharField(max_length=150, unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    title = models.CharField(max_length=150, unique=False)
    description = models.TextField()
    price = models.FloatField()
    discount = models.FloatField(validators=[MinValueValidator(1),  MaxValueValidator(100)], blank=True, null=True)
    stock = models.IntegerField(default=1)
    sold = models.IntegerField(default=0)
    category = models.ForeignKey(Category, related_name="products", on_delete=models.CASCADE)
    trending = models.BooleanField(default=False)
    slug = models.SlugField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, related_name="products", on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0)

    def get_discount(self):
        return self.price * (self.discount * 0.01)

    def __str__(self):
        return self.title


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, blank=True, null=True, related_name='post_image')
    image = models.ImageField(upload_to=product_img_path, null=True, blank=True)


def set_slug(sender, instance, *args, **kwargs):
    if instance.slug:
        return
    
    id = str(uuid.uuid4())
    title = str(instance.title).replace(' ', '-')
    instance.slug = slugify(f'{id[:8]}_{title}')

pre_save.connect(set_slug, sender=Product)