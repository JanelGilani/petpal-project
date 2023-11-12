# accounts/views.py

from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated

from .models import User, Shelter, PetSeeker
from .serializers import UserSerializer, ShelterSerializer, PetSeekerSerializer

class ShelterRegistrationView(generics.CreateAPIView):
    serializer_class = ShelterSerializer

    def perform_create(self, serializer):
        user_data = serializer.validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        serializer.save(user=user)

class PetSeekerRegistrationView(generics.CreateAPIView):
    serializer_class = PetSeekerSerializer

    def perform_create(self, serializer):
        user_data = serializer.validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        serializer.save(user=user)

# accounts/views.py

from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({'detail': 'Successfully logged in'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class ShelterProfileView(generics.RetrieveAPIView):
    serializer_class = ShelterSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Shelter.objects.get(user=self.request.user)

class PetSeekerProfileView(generics.RetrieveAPIView):
    serializer_class = PetSeekerSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return PetSeeker.objects.get(user=self.request.user)
