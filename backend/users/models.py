from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import (AbstractBaseUser, PermissionsMixin, BaseUserManager)
from .countries import Countries
# from phonenumber_field.modelfields import PhoneNumberField


class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError()
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)

        Cart = 'cart.Cart'
        cart = Cart.objects.create(user=user)
        cart.save()

        Wishlist = 'wishlist.Wishlist'
        wishlist = Wishlist.objects.create(user=user)
        wishlist.save()

        user.save()
        return user
    

    def create_superuser(self, email, password):
        user = self.create_user(email=email, password=password)
        user.is_superuser = True
        user.is_admin = True
        user.is_staff = True
        user.is_active = True
        user.save()
        return user


class User(AbstractBaseUser, PermissionsMixin):
    created_at = models.DateTimeField(auto_now_add=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=250, null=True, blank=True)
    last_name = models.CharField(max_length=150, null=True, blank=True)
    dni = models.CharField(max_length=8, blank=True, null=True)
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    phone = models.CharField(validator=[phone_regex], max_length=17, null=True, blank=True)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_delivery = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    objects = UserManager()

    def __str__(self):
        return self.email


class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='address')
    street_address = models.CharField(max_length=100)
    apartment_address = models.CharField(max_length=100)
    country = models.CharField(max_length=300, choices=Countries.choices)
    zip = models.CharField(max_length=100)
    default = models.BooleanField(default=False)

    def __str__(self):
        return self.user.email