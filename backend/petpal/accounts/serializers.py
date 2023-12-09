
from rest_framework import serializers
from .models import CustomUser, Shelter, PetSeeker, UserReport, Admin


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'seeker', 'shelter', 'admin')

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

class UserReportSerializer(serializers.ModelSerializer):
    reporter = CustomUserSerializer()
    reported = CustomUserSerializer()

    class Meta:
        model = UserReport
        fields = '__all__'

class AdminSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    reported_users = UserReportSerializer(many=True)

    class Meta:
        model = Admin
        fields = '__all__'

