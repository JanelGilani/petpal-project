from django.shortcuts import render

# Create your views here.
# views.py
from rest_framework import generics, permissions
from ..models import Comment, Application
from accounts.models import Shelter, CustomUser, PetSeeker
from .serializers import CommentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from notifications.models import Notifications
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse

class IsShelterOrPetSeeker(permissions.BasePermission):

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        application_id = view.kwargs['application_id']
        try:
            application = Application.objects.get(id=application_id)

        # Check if the user is the pet seeker or the shelter related to the application
            return application.seeker_user == request.user or application.pet.shelter == request.user
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
        shelter_user = get_object_or_404(CustomUser, pk=shelter_id)
        shelter = get_object_or_404(Shelter, user=shelter_user)
        comment = serializer.save(user=self.request.user, shelter=shelter)
        user = get_object_or_404(CustomUser, pk=self.request.user.id)
        reverse_url = reverse('comments:shelter-comment-details', args=[str(shelter_id), str(comment.id)])
        # Send notification to the user who owns the post
        Notifications.objects.create(
            title=f'New review on your shelter',
            body=f'New review on your shelter, check it out!',
            user=shelter_user,
            content_type=ContentType.objects.get_for_model(comment),
            object_id=comment.id,
            model_url = reverse_url
        )

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
        comment = serializer.save(user=self.request.user, application=application)
        #Update the last update time of the application
        application.last_update_time = comment.created_at
        application.save()
        
        user = get_object_or_404(CustomUser, pk=self.request.user.id)
        reverse_url = reverse('comments:application-comment-details', args=[str(application_id), str(comment.id)])
        # Send notification to the user who owns the application
        Notifications.objects.create(
            title=f'New comment on application {application_id}',
            body=f'New comment on your application {application_id}',
            user=user,
            content_type=ContentType.objects.get_for_model(comment),
            object_id=comment.id,
            model_url = reverse_url
        )

class CommentDetailView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        comment_id = self.kwargs['comment_id']
        comment = get_object_or_404(Comment, pk=comment_id)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)