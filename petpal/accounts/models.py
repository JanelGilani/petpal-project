# accounts/models.py

from django.db import models
from django.contrib.auth.models import User

class Shelter(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    contact_information = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    mission_statement = models.TextField()

    def delete(self, *args, **kwargs):
        # Delete associated User instance
        self.user.delete()
        super().delete(*args, **kwargs)

class PetSeeker(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    contact_information = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    preferences = models.TextField()
