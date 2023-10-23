from django.contrib import admin

from .models import Product, ProductImage, Category


class ProductAdmin(admin.ModelAdmin):
    readonly_fields = ('slug',)

admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImage)
admin.site.register(Category)