from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Address, User

# Register your models here.
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'dni', 'phone', 'is_admin', 'is_staff')
    search_fields = ('email', 'username')
    readonly_fields = ('id', 'created_at', 'is_admin')

    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()
    
admin.site.register(User, CustomUserAdmin)
admin.site.register(Address)