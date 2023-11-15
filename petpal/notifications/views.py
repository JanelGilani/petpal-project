from django.shortcuts import render
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView
from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.serializers import ModelSerializer
from rest_framework.reverse import reverse
from django.urls.exceptions import NoReverseMatch
from .models import Notifications
from .serializers import NotificationSerializer
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.contrib.contenttypes.models import ContentType
from rest_framework_simplejwt.authentication import JWTAuthentication


class NotificationDetailView(RetrieveAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notifications.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        notification_pk = self.kwargs.get('pk')

        instance = get_object_or_404(self.get_queryset(), pk=notification_pk)

        if instance.is_read == 'unread':
            instance.is_read = 'read'
            instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        notification_pk = self.kwargs.get('pk')
        instance = get_object_or_404(self.get_queryset(), pk=notification_pk)
        instance.delete()

        return Response({'detail': 'Notification deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class NotificationListView(ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        # Initial queryset filtering by user
        queryset = Notifications.objects.filter(user=self.request.user)

        # Read the 'is_read' query parameter and filter accordingly
        status_param = self.request.query_params.get('status', None)
        if status_param == 'read':
            queryset = queryset.filter(is_read='read')
        elif status_param == 'unread':
            queryset = queryset.filter(is_read='unread')
        
        # Sorting notifications by creation time
        queryset = queryset.order_by('-created_at')

        return queryset
