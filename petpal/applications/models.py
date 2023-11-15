from django.db import models
from accounts.models import CustomUser
from pet_listings.models import Pets

# class CustomUser(AbstractUser):
#     # Common fields for both Shelter and Pet Seeker
#     email = models.EmailField(unique=True)

class Application(models.Model):
    seeker_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE , related_name = "seeker_applications")
    shelter_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE , related_name = "shelter_applications")
    # user = models.IntegerField(default=1)
    # app_status = models.ForeignKey('Pets.status', on_delete=models.CASCADE)
    app_status = models.CharField(max_length=20,default='pending')
    pet = models.ForeignKey(Pets, on_delete=models.CASCADE,default=1)
    #shelter = models.IntegerField(default=1)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=254)
    address = models.TextField()
    pettype = models.CharField(max_length=100)
    petage = models.IntegerField()
    ownedbefore = models.CharField(max_length=300)
    plantoprovide = models.CharField(max_length=300)
    reason = models.CharField(max_length=300)
    emergencycontact = models.CharField(max_length=12)
    emergencyemail = models.EmailField(max_length=100)
    acknowledge = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
    last_update_time = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.name
    

    

# class Shelter(models.Model):
#     user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
#     contact_information = models.CharField(max_length=255)
#     location = models.CharField(max_length=255)
#     mission_statement = models.TextField()

# class PetListing(models.Model):
#     shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE)
#     name = models.CharField(max_length=255)
#     breed = models.CharField(max_length=255)
#     age = models.IntegerField()
#     gender = models.CharField(max_length=10)
#     size = models.CharField(max_length=10)
#     description = models.TextField()
#     status = models.CharField(max_length=20, default='available')
#     publication_date = models.DateTimeField(auto_now_add=True)





# Create your models here.
