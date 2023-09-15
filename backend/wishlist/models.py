from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total = models.IntegerField(default=0)


class WishlistProduct(models.Model):
    product = models.ForeignKey('products.Product', related='wishlist', on_delete=models.CASCADE)
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE)