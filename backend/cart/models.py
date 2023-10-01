from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_items = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='cart_items', on_delete=models.CASCADE)
    product = models.ForeignKey('products.Product', related_name='cart_items', on_delete=models.CASCADE)
    count = models.IntegerField()

    def __str__(self):
        return self.cart.user.username + ", " + self.product.title