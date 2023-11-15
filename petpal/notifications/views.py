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

    # def get_related_object_url(self, obj):
    #     try:
    #         if obj.content_type.model == 'comment':
    #             return reverse('comment-detail', args=[str(obj.object_id)], request=self.request)
    #         elif obj.content_type.model == 'application':
    #             return reverse('application-detail', args=[str(obj.object_id)], request=self.request)
    #         # Add more conditions for other models if needed

    #     except NoReverseMatch:
    #         return None



# from rest_framework.generics import ListCreateAPIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Comment, Notifications
# from .serializers import CommentSerializer
# from django.contrib.contenttypes.models import ContentType
# from rest_framework.permissions import AllowAny
# from rest_framework_simplejwt.authentication import JWTAuthentication
     
# class CommentCreateView(ListCreateAPIView):
#     authentication_classes = [JWTAuthentication]
#     serializer_class = CommentSerializer
#     permission_classes = [IsAuthenticated]  # Set the permission class to IsAuthenticated

#     def perform_create(self, serializer):
#         user = self.request.user  # Get the currently logged-in user
#         comment = serializer.save(user=user)

#         Notifications.objects.create(
#             title=f'New comment on post {comment.id}',
#             body=f'New comment on your post {comment.id}',
#             user=user,
#             content_type=ContentType.objects.get_for_model(comment),
#             object_id=comment.id
#         )
        
#         return Response({'detail': 'Comment created successfully'}, status=status.HTTP_201_CREATED)