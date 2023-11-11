from django.db import models
# import 

# Create your models here.
class Pets(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    description = models.TextField()
    image = models.ImageField(upload_to='images/')
    location = models.CharField(max_length=100)
    species = models.CharField(max_length=100)
    gender = models.CharField(max_length=100)
    color = models.CharField(max_length=100)
    breed = models.CharField(max_length=100)
    shelter = models.CharField(max_length=100)
    status = models.CharField(max_length=100, default="Available")
    date_added = models.DateTimeField(auto_now_add=True)
    # Shelter accounts.User should be changed to accounts.Shelter when Shelter model is created
    
    # shelter = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='pets')
    # application = models.ForeignKey('applications.Applications', on_delete=models.CASCADE, related_name='pets', null=True)
    # comments = models.ForeignKey('comments.Comments', on_delete=models.CASCADE, related_name='pets', null=True)

    def __str__(self):
        return self.name
    
class Collections(models.Model):
    # user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    pets = models.ManyToManyField('Pets', related_name='collections')
  