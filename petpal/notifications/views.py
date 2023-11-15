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
from .models import Notifications, Comment
from .serializers import NotificationSerializer, CommentSerializer
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
        # Get the notification pk from the URL parameter
        notification_pk = self.kwargs.get('pk')

        # Get the notification instance
        instance = get_object_or_404(self.get_queryset(), pk=notification_pk)

        # Check if the notification is not read and update is_read to True
        if not instance.is_read:
            instance.is_read = True
            instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

class NotificationListView(ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        # Initial queryset filtering by user
        queryset = Notifications.objects.filter(user=self.request.user)

        # Read the 'is_read' query parameter and filter accordingly
        is_read_param = self.request.query_params.get('is_read', None)
        if is_read_param is not None:
            is_read_param = bool(int(is_read_param))  # Convert 0/1 to False/True
            queryset = queryset.filter(is_read=is_read_param)

        # Sorting notifications by creation time
        queryset = queryset.order_by('-created_at')

        return queryset

# class NotificationDetailView(RetrieveAPIView):
#     serializer_class = NotificationSerializer
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         notification = self.get_object()
#         notification_serializer = self.serializer_class(notification)
#         related_object_url = self.get_related_object_url(notification)

#         if related_object_url:
#             try:
#                 response = requests.get(related_object_url)
#                 return Response(response.json(), status=response.status_code)
#             except requests.RequestException as e:
#                 return Response({'detail': f'Error making request: {str(e)}'}, status=500)
#         else:
#             return Response({'detail': 'Related object URL not found in the notification'}, status=400)

#     def get_related_object_url(self, obj):
#         try:
#             if obj.content_type.model == 'comment':
#                 return reverse('comment-detail', args=[str(obj.object_id)], request=self.request)
#             elif obj.content_type.model == 'application':
#                 return reverse('application-detail', args=[str(obj.object_id)], request=self.request)
#             # Add more conditions for other models if needed

#         except NoReverseMatch:
#             return None



from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import Comment, Notifications
from .serializers import CommentSerializer
from django.contrib.contenttypes.models import ContentType
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
     
class CommentCreateView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]  # Set the permission class to IsAuthenticated

    def perform_create(self, serializer):
        user = self.request.user  # Get the currently logged-in user
        comment = serializer.save(user=user)

        Notifications.objects.create(
            title=f'New comment on post {comment.id}',
            body=f'New comment on your post {comment.id}',
            user=user,
            content_type=ContentType.objects.get_for_model(comment),
            object_id=comment.id
        )
        
        return Response({'detail': 'Comment created successfully'}, status=status.HTTP_201_CREATED)