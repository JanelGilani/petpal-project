
from django.db import models
from accounts.models import CustomUser
from rest_framework import permissions

class IsShelterUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.shelter

class Pets(models.Model):
    shelter = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=False, default='')
    age = models.IntegerField(blank=False, default=0)
    species = models.CharField(max_length=100, blank=False, default='')
    breed = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    # image = models.ImageField(upload_to='pets')
    location = models.CharField(max_length=100, blank=False, default='')
    color = models.CharField(max_length=100, blank=False, default='')
    date_added = models.DateTimeField(auto_now_add=True, blank=False, null=True)
    # application = models.ManyToManyField(CustomUser, related_name='applications', blank=True)
    # comments = models.ManyToManyField('comments.Comments', related_name='pets', blank=True)

    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('Pending', 'Pending'),
        ('Adopted', 'Adopted'),
    ]
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
    ]
    SIZE_CHOICES = [
        ('Small', 'Small'),
        ('Medium', 'Medium'),
        ('Large', 'Large'),
    ]

    size = models.CharField(max_length=100, choices=SIZE_CHOICES, default='Small')
    gender = models.CharField(max_length=100, choices=GENDER_CHOICES, default='Male')
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, default='Available')


    def __str__(self):
        return self.name

    class Meta:
        permissions = [
            ("can_create_pets", "Can create pet listings"),
        ]
