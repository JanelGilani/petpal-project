# accounts/models.py

from django.db import models
from django.contrib.auth.models import User

class Shelter(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    contact_information = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    mission_statement = models.TextField()

class PetSeeker(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    contact_information = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    preferences = models.TextField()
