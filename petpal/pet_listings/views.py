import sys
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListCreateAPIView, RetrieveAPIView, ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate, login
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.shortcuts import get_object_or_404
from .models import Pets
from .serializers import PetsSerializer, PetsListSerializer
from io import BytesIO
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile

class PetCreateView(CreateAPIView):
    serializer_class = PetsSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def perform_create(self, serializer):
        user = self.request.user
        if not user.shelter:
            self.permission_denied(self.request, message='You do not have permission to create a pet listing.')
        if user.shelter:
            # Handle image upload if provided in the request
            image_data = self.request.data.get('image')
            if image_data:
                try:
                    image = Image.open(BytesIO(image_data.read()))
                    # Resize the image or perform any other processing if needed
                    output_buffer = BytesIO()
                    image.save(output_buffer, format='JPEG')
                    image_file = InMemoryUploadedFile(
                        output_buffer,
                        'ImageField',
                        f'{serializer.validated_data["name"]}_image.jpg',
                        'image/jpeg',
                        sys.getsizeof(output_buffer),
                        None
                    )
                    serializer.validated_data['image'] = image_file
                except Exception as e:
                    return Response({'detail': f'Error processing image: {str(e)}'},
                                    status=status.HTTP_400_BAD_REQUEST)

            # Save the pet with the shelter information
            serializer.save(shelter=user)
            # Explicitly return the desired response without including the serialized pet data
            return Response({'detail': 'Pet created successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'You do not have permission to create a pet listing.'}, status=status.HTTP_403_FORBIDDEN)


class PetListView(ListAPIView):
    queryset = Pets.objects.all()
    serializer_class = PetsSerializer
    permission_classes = [AllowAny]


class PetSearchView(ListAPIView):
    queryset = Pets.objects.all()
    serializer_class = PetsListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Default status filter is "Available" unless specified
        status_filter = self.request.GET.get('status', 'Available')

        queryset = Pets.objects.filter(status__iexact=status_filter)

        shelter_filter = self.request.GET.get('shelter')
        if shelter_filter:
            queryset = queryset.filter(shelter__iexact=shelter_filter)

        breed_filter = self.request.GET.get('breed')
        if breed_filter:
            queryset = queryset.filter(breed__iexact=breed_filter)

        age_filter = self.request.GET.get('age')
        if age_filter:
            queryset = queryset.filter(age__iexact=age_filter)

        size_filter = self.request.GET.get('size')
        if size_filter:
            queryset = queryset.filter(size__iexact=size_filter)

        color_filter = self.request.GET.get('color')
        if color_filter:
            queryset = queryset.filter(color__iexact=color_filter)

        gender_filter = self.request.GET.get('gender')
        if gender_filter:
            queryset = queryset.filter(gender__iexact=gender_filter)

        # Assuming date_added_filter is in the format 'YYYY-MM-DD'
        date_added_filter = self.request.GET.get('date_added')
        if date_added_filter:
            queryset = queryset.filter(date_added__date=date_added_filter)

        # Sorting options
        sort_by = self.request.GET.get('sort_by', 'name')
        if sort_by == 'age':
            queryset = queryset.order_by('age')
        elif sort_by == 'size':
            queryset = queryset.order_by('size')
        else:
            queryset = queryset.order_by('name')

        # Add image URL to each pet in the queryset
        for pet in queryset:
            pet.image_url = self.request.build_absolute_uri(pet.image.url) if pet.image else None

        return queryset


@api_view(['GET'])
@permission_classes([AllowAny])
def pet_detail(request, pet_id):
    pet = get_object_or_404(Pets, id=pet_id)
    serializer = PetsSerializer(pet)
    serializer_data = serializer.data
    serializer_data['image'] = request.build_absolute_uri(pet.image.url) if pet.image else None

    return Response(serializer_data)



@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def pet_update(request, pet_id):
    pet = get_object_or_404(Pets, id=pet_id)

    requesting_user = request.user
    if requesting_user.id != pet.shelter.id:
        return Response({'detail': 'You do not have permission to edit or delete this pet.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'DELETE':
        pet.delete()
        return Response({'detail': 'Pet deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

    serializer = PetsSerializer(pet, data=request.data)
    if serializer.is_valid():
        # Handle image update if provided in the request
        image_data = request.data.get('image')
        if image_data:
            try:
                image = Image.open(BytesIO(image_data.read()))
                # Resize the image or perform any other processing if needed
                output_buffer = BytesIO()
                image.save(output_buffer, format='JPEG')
                image_file = InMemoryUploadedFile(
                    output_buffer,
                    'ImageField',
                    f'{serializer.validated_data["name"]}_image.jpg',
                    'image/jpeg',
                    sys.getsizeof(output_buffer),
                    None
                )
                serializer.validated_data['image'] = image_file
            except Exception as e:
                return Response({'detail': f'Error processing image: {str(e)}'},
                                status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        # Add image URL to the response data
        serializer_data = serializer.data
        serializer_data['image'] = request.build_absolute_uri(pet.image.url) if pet.image else None

        return Response(serializer_data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)