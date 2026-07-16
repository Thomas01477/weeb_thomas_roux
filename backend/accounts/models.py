from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models


class CustomUserManager(UserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_active', True)
        return super().create_superuser(username, email, password, **extra_fields)


class CustomUser(AbstractUser):
    is_active = models.BooleanField(default=False)

    objects = CustomUserManager()
