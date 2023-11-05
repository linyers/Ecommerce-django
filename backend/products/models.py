from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.db.models.signals import pre_save
from django.conf import settings
import re
import uuid
import os

User = get_user_model()


def product_img_path(instance, filename):
    pattern = r'[a-zA-Z0-9_-]+'
    title = ' '.join(re.findall(pattern, instance.product.title))
    id = str(uuid.uuid4())[:4]
    image = f'products/{title}/{id}.jpg'
    full_path = os.path.join(settings.MEDIA_ROOT, image)

    if os.path.exists(full_path):
        os.remove(full_path)

    return image


class Category(models.Model):
    name = models.CharField(max_length=150, unique=True, primary_key=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    title = models.CharField(max_length=150, unique=False)
    description = models.TextField()
    category = models.ForeignKey(Category, related_name="products", on_delete=models.CASCADE)
    price = models.FloatField()
    discount = models.IntegerField(blank=True, null=True)
    stock = models.IntegerField(default=1)
    sold = models.IntegerField(default=0)
    used = models.BooleanField(default=False)
    trending = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField()
    author = models.ForeignKey(User, related_name="products", on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=None, null=True)

    def get_discount(self):
        return self.price * (self.discount * 0.01)

    def __str__(self):
        return self.title


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, blank=True, null=True, related_name='images')
    image = models.ImageField(upload_to=product_img_path, max_length=500, null=True, blank=True)

    def __str__(self) -> str:
        return settings.SITE + self.image.url


def set_slug(sender, instance, *args, **kwargs):
    try:
        if instance.slug.split('-', 1)[1] == slugify(instance.title.replace(' ', '-')):
            return
    except IndexError:
        pass
    id = str(uuid.uuid4())
    title = str(instance.title).replace(' ', '-')
    instance.slug = slugify(f'{id[:8]}-{title}')


pre_save.connect(set_slug, sender=Product)