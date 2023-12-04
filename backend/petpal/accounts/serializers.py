
from rest_framework import serializers
from .models import CustomUser, Shelter, PetSeeker


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'seeker', 'shelter')

class ShelterSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = Shelter
        fields = '__all__'

class PetSeekerSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = PetSeeker
        fields = '__all__'

