from rest_framework import serializers
from comments.models import ShelterComment, ApplicationComment

class ShelterCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShelterComment
        fields = '__all__'

class ApplicationCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationComment
        fields = '__all__'