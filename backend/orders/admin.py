from django.contrib import admin
from .models import Order, Purchase, Refund, Shipping


class OrderAdmin(admin.ModelAdmin):
    readonly_fields = ('payment', 'shipping', 'order_code', 'end_date')


admin.site.register(Order, OrderAdmin)
admin.site.register(Purchase)
admin.site.register(Refund)
admin.site.register(Shipping)