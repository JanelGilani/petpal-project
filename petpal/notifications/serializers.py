from rest_framework.serializers import ModelSerializer
from rest_framework.reverse import reverse
from django.urls.exceptions import NoReverseMatch
from django.urls import reverse
from . import models


class NotificationSerializer(ModelSerializer):
    class Meta:
        model = models.Notifications
        fields = '__all__'



class CommentSerializer(ModelSerializer):
    class Meta:
        model = models.Comment
        fields = ['id', 'user', 'body', 'created_at']
