from django.shortcuts import render

# Create your views here.
# views.py
from rest_framework import generics, permissions
from ..models import Comment, Application
from accounts.models import Shelter, CustomUser, PetSeeker
from .serializers import CommentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404


class IsShelterOrPetSeeker(permissions.BasePermission):

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        application_id = view.kwargs['application_id']
        try:
            application = Application.objects.get(id=application_id)

        # Check if the user is the pet seeker or the shelter related to the application
            return application.user == request.user or application.pet.shelter == request.user
        except Application.DoesNotExist:
            return False
        
 
    def has_object_permission(self, request, view, obj):
        application = obj.application

        return application.user == request.user or application.per.shelter == request.user

class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        return super().get_queryset()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ShelterCommentListCreateView(CommentListCreateView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        shelter_id = self.kwargs['shelter_id']
        return Comment.objects.filter(shelter__id=shelter_id)

    def perform_create(self, serializer):
        shelter_id = self.kwargs['shelter_id']
        shelter = get_object_or_404(Shelter, pk=shelter_id)
        serializer.save(user=self.request.user, shelter=shelter)
    

class ApplicationCommentListCreateView(CommentListCreateView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsShelterOrPetSeeker]

    def get_queryset(self):
        application_id = self.kwargs['application_id']
        return Comment.objects.filter(application__id=application_id)
    
    def perform_create(self, serializer):
        application_id = self.kwargs['application_id']
        application = get_object_or_404(Application, pk=application_id)
        serializer.save(user=self.request.user, application=application)
