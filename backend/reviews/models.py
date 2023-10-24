from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models.signals import post_save, post_delete

User = get_user_model()


class Review(models.Model):
    body = models.TextField()
    rate = models.IntegerField()
    author = models.ForeignKey(User, related_name="reviews", on_delete=models.CASCADE)
    product = models.ForeignKey('products.Product', related_name="reviews", on_delete=models.CASCADE)
    likes = models.ManyToManyField(User, blank=True, related_name='likes')
    dislikes = models.ManyToManyField(User, blank=True, related_name='dislikes')
    created_at = models.DateTimeField(auto_now_add=True)


def set_product_rating(sender, instance, *args, **kwargs):
    product = instance.product
    product.rating = Review.objects.filter(product=product).aggregate(models.Avg('rate'))['rate__avg']
    if product.rating is None:
        product.rating = 0
    product.save()


post_save.connect(set_product_rating, sender=Review)
post_delete.connect(set_product_rating, sender=Review)