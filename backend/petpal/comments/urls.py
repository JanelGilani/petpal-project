from django.urls import path
from .views import ShelterCommentListCreateView, ApplicationCommentListCreateView, CommentDetailView

app_name = 'comments'

urlpatterns = [
    path('shelters/<int:shelter_id>/comments/', ShelterCommentListCreateView.as_view(), name='shelter-comments'),
    path('applications/<int:application_id>/comments/', ApplicationCommentListCreateView.as_view(), name='application-comments'),
    path('applications/<int:application_id>/comments/<int:comment_id>/', CommentDetailView.as_view(), name='application-comment-details'),
    path('shelters/<int:shelter_id>/comments/<int:comment_id>/', CommentDetailView.as_view(), name='shelter-comment-details'),
]