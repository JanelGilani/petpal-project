# accounts/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    seeker = models.BooleanField(default=False)
    shelter = models.BooleanField(default=False)


class Shelter(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    mission_statement = models.TextField()

    # def delete(self, *args, **kwargs):
    #     # Delete associated User instance
    #     self.user.delete()
    #     super().delete(*args, **kwargs)

class PetSeeker(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    profile_picture = models.ImageField(upload_to='profile_pictures', blank=True, null=True)