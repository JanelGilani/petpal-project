from rest_framework import serializers
from .models import Application
class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'

    def update(self, instance, validated_data):
        # Allow 'status' to be updated only during update operation
        if 'app_status' in validated_data:
            instance.app_status = validated_data['app_status']
        instance.save(update_fields=['app_status'])
        return instance