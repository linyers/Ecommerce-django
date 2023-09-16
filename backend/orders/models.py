from django.db import models
from django.db.models.signals import post_save, pre_save
from django.contrib.auth import get_user_model
from django.utils import timezone
import uuid

User = get_user_model()


ORDER_STATUS_CHOICES = (
    ('pending', 'Pending'),
    ('cancelled', 'Cancelled'),
    ('confirm', 'Confirm'),
    ('on_the_way', 'On the way'),    
    ('delivered', 'Delivered'),   
)

class Order(models.Model):
    costumer = models.ForeignKey(User, related_name='order',on_delete=models.CASCADE)
    order_code = models.CharField(max_length=8, unique=True)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    shipping = models.ForeignKey('Shipping', related_name='order', on_delete=models.SET_NULL, null=True)
    shipping_address = models.ForeignKey('users.Address', on_delete=models.CASCADE)
    order_status = models.CharField(max_length=50, choices=ORDER_STATUS_CHOICES, default='pending')
    payment = models.OneToOneField('payment.Payment', related_name='order', on_delete=models.SET_NULL, null=True)
    
    def total_price(self):
        return sum([pucharse.get_final_price() for pucharse in self.pucharse.all()])


class Pucharse(models.Model):
    quantity = models.IntegerField(default=1)
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='pucharse')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='pucharse')

    def __str__(self) -> str:
        return f'{self.quantity} of {self.product.name}'

    def get_price(self):
        return self.quantity * self.product.price
    
    def get_discount_price(self):
        return self.quantity * self.product.get_discount()

    def get_final_price(self):
        if self.product.discount:
            return self.get_discount_price()
        return self.get_price()


class Refund(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    costumer = models.ForeignKey(User, on_delete=models.CASCADE)
    reason = models.TextField()
    accepted = models.BooleanField(default=False)

    def __str__(self):
        return f"refund of {self.order.order_code}"


class Shipping(models.Model):
    name = models.CharField(max_length=255, unique=True)
    end_shipping = models.DateTimeField()
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.name


def set_order_code(sender, instance, *args, **kwargs):
    id = str(uuid.uuid4())
    instance.order_code = f'{id[:8]}'

def set_order_address(sender, instance, *args, **kwargs):
    address = list(filter(lambda x: x.default, instance.costumer.address.all()))
    if address:
        instance.shipping_address = address[0]

def set_order_end_date(sender, instance, *args, **kwargs):
    if instance.order_status == 'delivered':
        instance.end_date = timezone.now

def set_stock(sender, instance, *args, **kwargs):
    instance.product.stock -= instance.quantity
    instance.product.sold += 1

pre_save.connect(set_order_code, sender=Order)
pre_save.connect(set_order_end_date, sender=Order)
pre_save.connect(set_order_address, sender=Order)
post_save.connect(set_stock, sender=Pucharse)
