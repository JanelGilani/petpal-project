from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListCreateAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import CustomUser, Shelter, PetSeeker
from .serializers import CustomUserSerializer, ShelterSerializer, PetSeekerSerializer
from rest_framework.generics import ListAPIView

class ShelterRegistrationView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ShelterSerializer
    
    def create(self, request, *args, **kwargs):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        shelter_name = data.get('shelter_name')
        location = data.get('location')
        mission_statement = data.get('mission_statement')

        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            password=password,
            shelter=True
        )
        Shelter(user=user, shelter_name=shelter_name, location=location, mission_statement=mission_statement).save()
        return Response({'detail': 'Shelter created successfully'}, status=status.HTTP_201_CREATED)

# # accounts/views.py
# from rest_framework import generics
# from rest_framework.permissions import IsAuthenticated, AllowAny

# from .models import Shelter, PetSeeker
# from .serializers import ShelterSerializer, PetSeekerSerializer

# class ShelterCreateView(generics.CreateAPIView):
#     serializer_class = ShelterSerializer
#     permission_classes = [AllowAny]

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user, shelter_user=self.request.user)

# class PetSeekerCreateView(generics.CreateAPIView):
#     serializer_class = PetSeekerSerializer
#     permission_classes = [AllowAny]

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user, seeker_user=self.request.user)


class ShelterProfileView(RetrieveAPIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = ShelterSerializer

    def retrieve(self, request, *args, **kwargs):
        username = kwargs['username']
        user = get_object_or_404(CustomUser, username=username)

        try:
            shelter = Shelter.objects.get(user=user)
            serializer = self.get_serializer(shelter)
            return Response(serializer.data)
        except Shelter.DoesNotExist:
            return Response({'detail': 'Shelter not found.'}, status=status.HTTP_404_NOT_FOUND)
        


class PetSeekerRegistrationView(CreateAPIView):
    queryset = PetSeeker.objects.all()
    serializer_class = PetSeekerSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user_serializer = CustomUserSerializer(data=self.request.data.get('user'))
        if user_serializer.is_valid():
            user = user_serializer.save()
            serializer.save(user=user)
        else:
            Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# accounts/views.py

from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# class LoginView(APIView):
#     def post(self, request, *args, **kwargs):
#         username = request.data.get('username')
#         password = request.data.get('password')

#         user = authenticate(request, username=username, password=password)

#         if user is not None:
#             login(request, user)
#             return Response({'detail': 'Successfully logged in'}, status=status.HTTP_200_OK)
#         else:
#             return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .models import Shelter, PetSeeker
from .serializers import ShelterSerializer, PetSeekerSerializer
from rest_framework import status
from rest_framework.response import Response

# accounts/views.py

from rest_framework.generics import RetrieveAPIView
from .models import Shelter, PetSeeker
from .serializers import ShelterSerializer, PetSeekerSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

# class ShelterProfileView(APIView): 
    
#     permission_classes = [IsAuthenticated]
#     serializer_class = ShelterSerializer

#     def retrieve(self, request, *args, **kwargs):
#         username = kwargs['username']
#         user = get_object_or_404(CustomUser, username=username)

#         try:
#             shelter = Shelter.objects.get(user=user)
#             serializer = self.get_serializer(shelter)
#             return Response(serializer.data)
#         except Shelter.DoesNotExist:
#             return Response({'detail': 'Shelter not found.'}, status=status.HTTP_404_NOT_FOUND)
        

class PetSeekerProfileView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PetSeekerSerializer

    def retrieve(self, request, *args, **kwargs):
        username = kwargs['username']
        user = get_object_or_404(CustomUser, username=username)

        try:
            pet_seeker = PetSeeker.objects.get(user=user)
            serializer = self.get_serializer(pet_seeker)
            return Response(serializer.data)
        except PetSeeker.DoesNotExist:
            return Response({'detail': 'Pet Seeker not found.'}, status=status.HTTP_404_NOT_FOUND)

class ListSheltersView(ListAPIView): 
    permission_classes = [IsAuthenticated]
    serializer_class = ShelterSerializer
    queryset = Shelter.objects.all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

# accounts/views.py

from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Shelter
from .serializers import ShelterSerializer

class ShelterDeleteView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]  # Change to IsAuthenticated
    serializer_class = ShelterSerializer
    queryset = Shelter.objects.all()

    def delete(self, request, *args, **kwargs):
        shelter = self.get_object()

        # Check if the current user is the owner of the shelter
        if request.user == shelter.user:
            user = shelter.user
            shelter.delete()
            user.delete()
            return Response({'detail': 'Shelter and associated User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'detail': 'You do not have permission to delete this shelter.'}, status=status.HTTP_403_FORBIDDEN)


from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import PetSeeker
from .serializers import PetSeekerSerializer

class PetSeekerDeleteView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]  # Change to IsAuthenticated
    serializer_class = PetSeekerSerializer
    queryset = PetSeeker.objects.all()

    def delete(self, request, *args, **kwargs):
        pet_seeker = self.get_object()

        # Check if the current user is the owner of the pet seeker profile
        if request.user == pet_seeker.user:
            pet_seeker.delete()
            return Response({'detail': 'Pet Seeker profile deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'detail': 'You do not have permission to delete this pet seeker profile.'}, status=status.HTTP_403_FORBIDDEN)