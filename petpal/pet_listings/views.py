from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListCreateAPIView, RetrieveAPIView, ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login
from rest_framework.permissions import IsAuthenticated
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
    serializer_class = PetsListSerializer
    permission_classes = [AllowAny]


    
