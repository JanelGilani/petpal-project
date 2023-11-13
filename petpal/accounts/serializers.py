
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Shelter, PetSeeker

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

class ShelterSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Shelter
        fields = '__all__'

class PetSeekerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = PetSeeker
        fields = '__all__'
