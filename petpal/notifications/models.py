from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from accounts.models import CustomUser
# Create your models here.

class Notifications(models.Model):
    STATUS_CHOICES = (
        ('unread', 'unread'),
        ('read', 'read'),
    )

    title = models.CharField(max_length=100)
    body = models.TextField()
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.CharField(max_length=10, choices=STATUS_CHOICES, default='unread')
    model_url = models.CharField(max_length=100, default='')

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
