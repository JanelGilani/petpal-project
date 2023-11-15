from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListCreateAPIView, RetrieveAPIView, ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import Pets
from .serializers import PetsSerializer, PetsListSerializer


class PetCreateView(ListCreateAPIView):
    # queryset = Pets.objects.all()
    serializer_class = PetsSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        shelter = self.request.user.shelter
        if shelter:
            serializer.save(shelter=self.request.user)
            Response({'detail': 'Pet created successfully'}, status=status.HTTP_201_CREATED)
        else:
            Response({'detail': 'User is not a shelter.'}, status=status.HTTP_400_BAD_REQUEST)


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

        return queryset


@api_view(['GET'])
@permission_classes([AllowAny])
def pet_detail(request, pet_id):
    pet = get_object_or_404(Pets, id=pet_id)
    serializer = PetsSerializer(pet)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def pet_update(request, pet_id):
    pet = get_object_or_404(Pets, id=pet_id)

    requesting_user = request.user
    if requesting_user.id != pet.shelter.id:
        return Response({'detail': 'You do not have permission to edit this pet.'}, status=status.HTTP_403_FORBIDDEN)

    serializer = PetsSerializer(pet, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)