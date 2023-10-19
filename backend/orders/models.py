from django.db import models
from django.db.models.signals import post_save, pre_save
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import uuid

User = get_user_model()


class purchaseManager(models.Manager):
    def bulk_create(self, objs, **kwargs) -> list:
        a = super(models.Manager,self).bulk_create(objs,**kwargs)
        for i in objs:
            post_save.send(i.__class__, instance=i, created=True)
        return a
    
    def range_week_date(self):
        today = timezone.now().strftime("%Y-%m-%d")

        start_date = timezone.now() - timedelta(days=7)
        start_date = start_date.strftime("%Y-%m-%d")

        return self.filter(purchase_date__range=[start_date, today])


class OrderManager(models.Manager):
    def waiting_shipping(self):
        return self.filter(shipping=None).filter(order_status='confirm')


ORDER_STATUS_CHOICES = (
    ('on_the_way', 'On the way'),
    ('delivered', 'Delivered'),
    ('refunded', 'Refunded'),
)

class Order(models.Model):
    costumer = models.ForeignKey(User, related_name='order', on_delete=models.CASCADE)
    order_code = models.CharField(max_length=8, unique=True)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    with_shipping = models.BooleanField()
    shipping = models.OneToOneField('Shipping', related_name='order', on_delete=models.SET_NULL, null=True)
    from_address = models.ForeignKey('users.Address', related_name='from_address', on_delete=models.CASCADE, null=True)
    to_address = models.ForeignKey('users.Address', related_name='to_address', on_delete=models.CASCADE, null=True)
    order_status = models.CharField(max_length=50, choices=ORDER_STATUS_CHOICES, default='pending')
    payment = models.OneToOneField('payment.Payment', related_name='order', on_delete=models.SET_NULL, null=True)
    
    objects = OrderManager()

    def total_price(self):
        return sum([purchase.get_final_price() for purchase in self.purchase.all()])


class Purchase(models.Model):
    quantity = models.IntegerField()
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='purchase')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='purchases', null=True)
    purchase_date = models.DateField(auto_now_add=True)

    objects = purchaseManager()

    def __str__(self):
        return f'{self.quantity} of {self.product.title}'

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
    end_shipping = models.DateTimeField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    # name = models.CharField(max_length=100, null=True, blank=True)
    # deliverer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shipping')


def set_order_code(sender, instance, *args, **kwargs):
    if instance.order_code:
        return
    id = str(uuid.uuid4())
    instance.order_code = f'{id[:8]}'


def set_order_end_date(sender, instance, *args, **kwargs):
    if instance.order_status == 'delivered':
        instance.end_date = timezone.now


def set_stock(sender, instance, *args, **kwargs):
    instance.product.stock -= instance.quantity
    instance.product.sold += instance.quantity
    instance.product.save()


def set_trending(sender, instance, *args, **kwargs):
    purchase = Purchase.objects.range_week_date().filter(product__id=instance.product.id)
    sold = sum([p.quantity for p in purchase])
    if sold > 100:
        instance.product.trending = True
        instance.product.save()
        return
    
    instance.product.trending = False
    instance.product.save()


pre_save.connect(set_order_code, sender=Order)
pre_save.connect(set_order_end_date, sender=Order)
post_save.connect(set_stock, sender=Purchase)
post_save.connect(set_trending, sender=Purchase)