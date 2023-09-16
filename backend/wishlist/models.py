from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total = models.IntegerField(default=0)


class WishlistProduct(models.Model):
    product = models.ForeignKey('products.Product', related_name='wishlist', on_delete=models.CASCADE)
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE)