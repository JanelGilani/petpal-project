from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListCreateAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Application, CustomUser, Shelter, PetSeeker
from .serializers import CustomUserSerializer, ShelterSerializer, PetSeekerSerializer
from rest_framework.generics import ListAPIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.generics import UpdateAPIView

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

        # Validate required fields
        if not (username and email and password and shelter_name and location and mission_statement):
            return Response({'detail': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create CustomUser instance
            user = CustomUser.objects.create_user(
                username=username,
                email=email,
                password=password,
                shelter=True
            )
            
            # Create Shelter instance
            Shelter(user=user, shelter_name=shelter_name, location=location, mission_statement=mission_statement).save()

            return Response({'detail': 'Shelter created successfully'}, status=status.HTTP_201_CREATED)

        except IntegrityError:
            return Response({'detail': 'Username or email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'detail': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PetSeekerRegistrationView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = PetSeekerSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        seeker_name = data.get('seeker_name')
        location = data.get('location')
        profile_picture = data.get('profile_picture')

        # Validate required fields
        if not (username and email and password and seeker_name and location):
            return Response({'detail': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create CustomUser instance
            user = CustomUser.objects.create_user(
                username=username,
                email=email,
                password=password,
                seeker=True
            )
            
            # Create PetSeeker instance
            PetSeeker(user=user, seeker_name=seeker_name, location=location, profile_picture=profile_picture).save()

            return Response({'detail': 'Pet Seeker created successfully'}, status=status.HTTP_201_CREATED)

        except IntegrityError:
            return Response({'detail': 'Username or email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'detail': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class ShelterProfileView(APIView): 
    permission_classes = [IsAuthenticated]
    serializer_class = ShelterSerializer

    def get(self, request, *args, **kwargs):
        username = kwargs['username']
        
        try:
            user = CustomUser.objects.get(username=username)
            # Try to get the associated shelter
            shelter = Shelter.objects.get(user=user)
            serializer = self.serializer_class(shelter)  # Use the serializer class directly
            return Response(serializer.data)
        except Shelter.DoesNotExist:
            return Response({'detail': 'Shelter not found.'}, status=status.HTTP_404_NOT_FOUND)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'Shelter not found.'}, status=status.HTTP_404_NOT_FOUND)


class PetSeekerProfileView(APIView): 
    permission_classes = [IsAuthenticated]
    serializer_class = PetSeekerSerializer

    def get(self, request, *args, **kwargs):
        username = kwargs['username']
        
        try:
            user = CustomUser.objects.get(username=username)
            pet_seeker = PetSeeker.objects.get(user=user)

            if not request.user.shelter:
                return Response({'detail': 'Permission denied. User is not a shelter.'}, status=status.HTTP_403_FORBIDDEN)

            # if Application.objects.filter(shelter__user=shelter_user, pet_seeker=pet_seeker, is_active=True).exists():
            #     serializer = self.serializer_class(pet_seeker)
            #     return Response(serializer.data)
            # else:
            #     return Response({'detail': 'Permission denied. No active application.'}, status=status.HTTP_403_FORBIDDEN)
            serializer = self.serializer_class(pet_seeker)
            return Response(serializer.data)

        except PetSeeker.DoesNotExist:
            return Response({'detail': 'Pet Seeker not found.'}, status=status.HTTP_404_NOT_FOUND)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'Pet Seeker not found.'}, status=status.HTTP_404_NOT_FOUND)


class ListSheltersView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShelterSerializer

    def get_queryset(self):
        return Shelter.objects.all()



class ShelterUpdateView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShelterSerializer

    def get_object(self):
        username = self.kwargs['username']
        return get_object_or_404(Shelter, user__username=username)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data

        # Ensure that the user making the request is the owner of the shelter
        if request.user != instance.user:
            return Response({'detail': 'Permission denied. You are not the owner of this shelter.'}, status=status.HTTP_403_FORBIDDEN)

        # Fields to update
        fields_to_update = ['username', 'email', 'password', 'shelter_name', 'location', 'mission_statement']

        for field in fields_to_update:
            value = data.get(field)

            if value is not None:
                if field in ['username', 'email', 'password']:
                    setattr(instance.user, field, value)
                else:
                    setattr(instance, field, value)

        try:
            instance.user.save()
            instance.save()

            # Serialize the updated instance
            serializer = self.serializer_class(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except IntegrityError:
            return Response({'detail': 'Username or email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'detail': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class PetSeekerUpdateView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PetSeekerSerializer

    def get_object(self):
        username = self.kwargs['username']
        return get_object_or_404(PetSeeker, user__username=username)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data

        # Ensure that the user making the request is the owner of the pet seeker profile
        if request.user != instance.user:
            return Response({'detail': 'Permission denied. You are not the owner of this pet seeker profile.'}, status=status.HTTP_403_FORBIDDEN)

        # Fields to update
        fields_to_update = ['username', 'email', 'password', 'seeker_name', 'location', 'profile_picture']

        for field in fields_to_update:
            value = data.get(field)

            if value is not None:
                if field in ['username', 'email', 'password']:
                    setattr(instance.user, field, value)
                else:
                    setattr(instance, field, value)

        try:
            instance.user.save()
            instance.save()

            # Serialize the updated instance
            serializer = self.serializer_class(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except IntegrityError:
            return Response({'detail': 'Username or email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'detail': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)