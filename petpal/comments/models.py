from django.db import models

# Create your models here.

class ShelterComment(models.Model):
    shelter = models.CharField(max_length=100)
    user = models.CharField(max_length=100)
    comment = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)

    # Shelter accounts.User should be changed to accounts.Shelter when Shelter model is created
    # shelter = models.ForeignKey('accounts.User', on_delete=models.CASCADE) 

    #user = models.ForeignKey(accounts.User, on_delete=models.CASCADE, related_name='username')

    class Meta:
        ordering = ['-creation_time']

class ApplicationComment(models.Model):
    application = models.CharField(max_length=100)
    applied_user = models.CharField(max_length=100)
    applied_shelter = models.CharField(max_length=100)
    content = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)

    #application = models.ForeignKey('applications.Applications', on_delete=models.CASCADE, related_name='app_id')
    #applied_user = models.ForeignKey('applications.Applications', on_delete=models.CASCADE, related_name='user')

    class Meta:
        ordering = ['-creation_time']
    
class Comment(models.Model):
    pet = models.ForeignKey(Pets, on_delete=models.CASCADE)