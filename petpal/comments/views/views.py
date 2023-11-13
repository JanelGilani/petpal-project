from django.shortcuts import render

# Create your views here.
# views.py

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .models import ShelterComment, ApplicationComment
from .serializers import ShelterCommentSerializer, ApplicationCommentSerializer

class SetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ShelterCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = ShelterCommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = SetPagination

    def get_queryset(self):
        shelter_id = self.request.query_params.get('shelter')
        return ShelterComment.objects.filter(shelter=shelter_id).order_by('-creation_time')

    def perform_create(self, serializer):
        shelter_id = self.request.data.get('shelter')
        serializer.save(user=self.request.user, shelter=shelter_id)

class ApplicationCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = ApplicationCommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = SetPagination

    def get_queryset(self):
        user_id = self.request.query_params.get('applied_user')
        return ApplicationComment.objects.filter(applied_user=user_id).order_by('-creation_time')

    def perform_create(self, serializer):
        user_id = self.request.data.get('applied_user')
        serializer.save(user=self.request.user, applied_user=user_id)
