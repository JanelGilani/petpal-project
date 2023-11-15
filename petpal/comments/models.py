
from django.db import models
from django.conf import settings
from accounts.models import CustomUser, Shelter
from applications.models import Application

class Comment(models.Model):
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE, null=True, blank=True)
    application = models.ForeignKey(Application, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

# class Application(models.Model):
#     shelter = models.ForeignKey('accounts.Shelter', on_delete=models.CASCADE)
#     pet_seeker = models.ForeignKey('accounts.PetSeeker', on_delete=models.CASCADE)
#     is_active = models.BooleanField(default=False)