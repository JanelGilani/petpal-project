import sys
from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListCreateAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import CustomUser, Shelter, PetSeeker, Admin, UserReport
from applications.models import Application
from pet_listings.models import Pets
from .serializers import CustomUserSerializer, ShelterSerializer, PetSeekerSerializer, AdminSerializer, UserReportSerializer
from rest_framework.generics import ListAPIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.generics import UpdateAPIView
from rest_framework.generics import DestroyAPIView
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework_simplejwt.authentication import JWTAuthentication


class UserInfoFromIdView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CustomUserSerializer

    def get(self, request, *args, **kwargs):
        id = kwargs['id']
        try:
            user = CustomUser.objects.get(id=id)
            serializer = self.serializer_class(user)
            return Response(serializer.data)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

class UserInfoView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CustomUserSerializer

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = self.serializer_class(user)
        return Response(serializer.data)
    

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
        if not (username and email and password and seeker_name):
            return Response({'detail': ' username, email, password and seeker_name required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create CustomUser instance
            user = CustomUser.objects.create_user(
                username=username,
                email=email,
                password=password,
                seeker=True
            )

            if profile_picture:
                image = Image.open(BytesIO(profile_picture.read()))
                # Resize the image or perform any other processing if needed
                # Save the processed image back to profile_picture field
                output_buffer = BytesIO()
                image.save(output_buffer, format='JPEG') 
                profile_picture = InMemoryUploadedFile(
                    output_buffer,
                    'ImageField',
                    f'{username}_profile.jpg',
                    'image/jpeg',
                    sys.getsizeof(output_buffer),
                    None
                )
            
            # Create PetSeeker instance
            PetSeeker(user=user, seeker_name=seeker_name, location=location, profile_picture=profile_picture).save()

            return Response({'detail': 'Pet Seeker created successfully'}, status=status.HTTP_201_CREATED)

        except IntegrityError:
            return Response({'detail': 'Username or email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'detail': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ListSheltersView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ShelterSerializer

    def get_queryset(self):
        return Shelter.objects.all()


class ShelterProfileView(APIView): 
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ShelterSerializer

    def get(self, request, *args, **kwargs):
        # Log the kwargs
        id = kwargs['id']
        try:
            # user = CustomUser.objects.get(username=kwargs['username'])
            user = CustomUser.objects.get(id=id)
            # Try to get the associated shelter
            shelter = Shelter.objects.get(user=user)
            serializer = self.serializer_class(shelter)  # Use the serializer class directly
            return Response(serializer.data)
        except Shelter.DoesNotExist:
            return Response({'detail': 'Shelter not found.'}, status=status.HTTP_404_NOT_FOUND)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'Shelter not found.'}, status=status.HTTP_404_NOT_FOUND)


class PetSeekerProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PetSeekerSerializer

    def get(self, request, *args, **kwargs):
        id = kwargs['id']
        
        try:
            # seeker_user = CustomUser.objects.get(username=username)
            seeker_user = CustomUser.objects.get(id=id)
            pet_seeker = PetSeeker.objects.get(user=seeker_user)

            if (not self.request.user.shelter) and (self.request.user != pet_seeker.user):
                return Response({'detail': 'Permission denied. User is not a shelter or the owner of the pet seeker profile'}, status=status.HTTP_403_FORBIDDEN)
            
            if self.request.user.shelter:
                shelter_user = CustomUser.objects.filter(id=self.request.user.id).first()

                if Application.objects.filter(shelter_user=shelter_user, seeker_user=seeker_user).exists():
                    serializer = self.serializer_class(pet_seeker)
                    serializer.data['profile_picture'] = self.get_profile_picture_url(request, pet_seeker.profile_picture)
                    return Response(serializer.data)
                else:
                    return Response({'detail': 'Permission denied. No active application.'}, status=status.HTTP_403_FORBIDDEN)
            
            elif self.request.user == pet_seeker.user:
                serializer = self.serializer_class(pet_seeker)
                serializer.data['profile_picture'] = self.get_profile_picture_url(request, pet_seeker.profile_picture)
                return Response(serializer.data)

        except PetSeeker.DoesNotExist:
            return Response({'detail': 'Pet Seeker not found.'}, status=status.HTTP_404_NOT_FOUND)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'Pet Seeker not found.'}, status=status.HTTP_404_NOT_FOUND)

    def get_profile_picture_url(self, request, profile_picture):
        if profile_picture:
            return request.build_absolute_uri(profile_picture.url)
        return None


class ShelterUpdateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ShelterSerializer

    def get_object(self, id):
        return get_object_or_404(Shelter, user__id=id)

    def put(self, request, id, *args, **kwargs):
        instance = self.get_object(id)
        data = request.data

        if request.user != instance.user:
            return Response({'detail': 'Permission denied. You are not the owner of this shelter.'}, status=status.HTTP_403_FORBIDDEN)

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
            serializer = self.serializer_class(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except IntegrityError:
            return Response({'detail': 'Username or email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'detail': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, id, *args, **kwargs):
        instance = self.get_object(id)

        # Admins can delete shelters
        if not request.user.admin and request.user != instance.user:
            return Response({'detail': 'Permission denied. You are not the owner of this shelter.'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            instance.user.delete()
            return Response({'detail': 'Shelter deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response({'detail': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PetSeekerUpdateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PetSeekerSerializer

    def get_object(self, id):
        return get_object_or_404(PetSeeker, user__id=id)

    def put(self, request, id, *args, **kwargs):
        instance = self.get_object(id)
        data = request.data

        if request.user != instance.user:
            return Response({'detail': 'Permission denied. You are not the owner of this pet seeker profile.'}, status=status.HTTP_403_FORBIDDEN)

        fields_to_update = ['username', 'email', 'password', 'seeker_name', 'location', 'profile_picture']
        global_id = data.get('id')
        for field in fields_to_update:
            value = data.get(field)

            if value is not None:
                if field in ['username', 'email', 'password']:
                    setattr(instance.user, field, value)
                elif field == 'profile_picture':
                    instance.profile_picture = self.process_profile_picture(value, id=global_id)
                else:
                    setattr(instance, field, value)

        try:
            instance.user.save()
            instance.save()
            serializer = self.serializer_class(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except IntegrityError:
            return Response({'detail': 'Username or email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'detail': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, id, *args, **kwargs):
        instance = self.get_object(id)

        # Admins can delete pet seekers
        if not request.user.admin and request.user != instance.user:
            return Response({'detail': 'Permission denied. You are not the owner of this pet seeker profile.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            if instance.profile_picture:
                instance.profile_picture.delete()

            instance.user.delete()
            return Response({'detail': 'Pet Seeker deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response({'detail': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def process_profile_picture(self, profile_picture, id):
        if profile_picture:
            image = Image.open(BytesIO(profile_picture.read()))
            output_buffer = BytesIO()
            image.save(output_buffer, format='JPEG')
            profile_picture = InMemoryUploadedFile(
                output_buffer,
                'ImageField',
                f'{id}_profile.jpg',
                'image/jpeg',
                sys.getsizeof(output_buffer),
                None
            )
            return profile_picture
        return None
    

class AdminRegistrationView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = CustomUserSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        admin_name = data.get('admin_name')

        # Validate required fields
        if not (username and email and password and admin_name):
            return Response({'detail': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create CustomUser instance
            user = CustomUser.objects.create_user(
                username=username,
                email=email,
                password=password,
                seeker=True,
                shelter=True,
                admin=True
            )
            
            # Create Admin instance
            Admin(user=user, admin_name=admin_name).save()

            return Response({'detail': 'Admin created successfully'}, status=status.HTTP_201_CREATED)

        except IntegrityError:
            return Response({'detail': 'Username or email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'detail': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AdminSerializer

    def get(self, request, *args, **kwargs):
        id = kwargs['id']
        try:
            # user = CustomUser.objects.get(username=kwargs['username'])
            user = CustomUser.objects.get(id=id)
            # Try to get the associated shelter
            admin = Admin.objects.get(user=user)
            serializer = self.serializer_class(admin)  # Use the serializer class directly
            return Response(serializer.data)
        except Admin.DoesNotExist:
            return Response({'detail': 'Admin not found.'}, status=status.HTTP_404_NOT_FOUND)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'Admin not found.'}, status=status.HTTP_404_NOT_FOUND)


class UserReportView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserReportSerializer

    def post(self, request, *args, **kwargs):
        data = request.data
        reporter_id = data.get('reporter_id')
        reported_id = data.get('reported_id')

        if not (reporter_id and reported_id):
            return Response({'detail': 'Both reporter_id and reported_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        print(reporter_id, reported_id)
        reporter = get_object_or_404(CustomUser, id=reporter_id)
        reported = get_object_or_404(CustomUser, id=reported_id)

        if reporter == reported:
            return Response({'detail': 'You cannot report yourself'}, status=status.HTTP_400_BAD_REQUEST)

        user_report_instance = UserReport.objects.create(reporter=reporter, reported=reported)
        
        # Get all the admins and add the user_report_instance to their reported_users field
        admins = Admin.objects.all()
        for admin in admins:
            admin.reported_users.add(user_report_instance)
            admin.save()
        
        return Response({'detail': 'User reported successfully'}, status=status.HTTP_201_CREATED)


class AdminReportedUsersView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserReportSerializer

    def get(self, request, *args, **kwargs):
        id = kwargs['id']
        try:
            user = CustomUser.objects.get(id=id)
            # Check if the user is an admin
            if not user.admin:
                return Response({'detail': 'Permission denied. User is not an admin'}, status=status.HTTP_403_FORBIDDEN)
            admin = Admin.objects.get(user=user)
            reported_users = admin.reported_users.all()
            serializer = self.serializer_class(reported_users, many=True)  # Use the serializer class directly
            return Response(serializer.data)
        except Admin.DoesNotExist:
            return Response({'detail': 'Admin not found.'}, status=status.HTTP_404_NOT_FOUND)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'Admin not found.'}, status=status.HTTP_404_NOT_FOUND)
        

class AdminDeleteView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserReportSerializer

    def delete(self, request, *args, **kwargs):
        admin_id = kwargs['id']
        reported_user_id = kwargs['reported_user_id']
        try:
            admin = Admin.objects.get(user__id=admin_id)
            reported_user = CustomUser.objects.get(id=reported_user_id)

            # Get all UserReport instances related to the reported user
            user_reports = UserReport.objects.filter(reported=reported_user)

            # Remove the instances from the admin's reported_users field
            admin.reported_users.remove(*user_reports)

            # Delete the reported user
            reported_user.delete()
        
            print("Deleted successfully")
            return Response({'detail': 'Reported user deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Admin.DoesNotExist:
            print("Admin not found.")
            return Response({'detail': 'Admin not found.'}, status=status.HTTP_404_NOT_FOUND)
        except CustomUser.DoesNotExist:
            print("Reported user not found.")
            return Response({'detail': 'Reported user not found.'}, status=status.HTTP_404_NOT_FOUND)
        except UserReport.DoesNotExist:
            print("User reports not found.")
            return Response({'detail': 'User reports not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return Response({'detail': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

