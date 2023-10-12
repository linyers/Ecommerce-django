from django.db import models
from django.contrib.auth.models import (AbstractBaseUser, PermissionsMixin, BaseUserManager)
from django.conf import settings
import os
from .countries import Countries

from cart.models import Cart
from wishlist.models import Wishlist


def user_pic_directory_path(instance, filename):
    pic = 'users/{0}/pic.jpg'.format(instance.email)
    full_path = os.path.join(settings.MEDIA_ROOT, pic)

    if os.path.exists(full_path):
        os.remove(full_path)

    return pic


class UserManager(BaseUserManager):
    def create_user(self, email, username, password, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users must have a username")
        
        user = self.model(email=self.normalize_email(email), username=username, **extra_fields)
        user.set_password(password)

        user.save()

        cart = Cart.objects.create(user=user)
        cart.save()

        wishlist = Wishlist.objects.create(user=user)
        wishlist.save()

        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(email=email, username=username, password=password)
        user.is_deliverer = True
        user.is_superuser = True
        user.is_admin = True
        user.is_staff = True
        user.is_active = True
        user.save()
        return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100, unique=True)
    pic = models.ImageField(upload_to=user_pic_directory_path, null=True, blank=True)
    first_name = models.CharField(max_length=80, null=True, blank=True)
    last_name = models.CharField(max_length=80, null=True, blank=True)
    dni = models.CharField(max_length=8, blank=True, null=True)
    phone = models.CharField(max_length=17, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    is_deliverer = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    class Meta:
        app_label = 'users'

    def __str__(self):
        return self.username


class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='address', null=True)
    street_address = models.CharField(max_length=100)
    apartment_address = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=300, choices=Countries.choices)
    city = models.CharField(max_length=300)
    zip = models.CharField(max_length=100)
    default = models.BooleanField(default=False)

    def __str__(self):
        return self.user.email