# accounts/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    seeker = models.BooleanField(default=False)
    shelter = models.BooleanField(default=False)
    admin = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_user_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

class Shelter(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='shelter_user')
    shelter_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    mission_statement = models.TextField()

class PetSeeker(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='seeker_user', )
    seeker_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    # preferences = models.CharField(max_length=255)
    profile_picture = models.ImageField(upload_to='static', blank=True, null=True)


class UserReport(models.Model):
    reporter = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reported_by')
    reported = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reports_received')
    date = models.DateTimeField(auto_now_add=True)

class Admin(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='admin_user')
    admin_name = models.CharField(max_length=255)
    reported_users = models.ManyToManyField(UserReport, related_name='reported_users', blank=True)


