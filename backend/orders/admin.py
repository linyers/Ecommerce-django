from django.contrib import admin
from .models import Order, Pucharse, Refund, Shipping


class OrderAdmin(admin.ModelAdmin):
    readonly_fields = ('payment', 'shipping', 'order_code', 'end_date')


admin.site.register(Order, OrderAdmin)
admin.site.register(Pucharse)
admin.site.register(Refund)
admin.site.register(Shipping)