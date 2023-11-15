from django.urls import path
from .views import ShelterCommentListCreateView, ApplicationCommentListCreateView

app_name = 'comments'

urlpatterns = [
    path('shelters/<int:shelter_id>/comments/', ShelterCommentListCreateView.as_view(), name='shelter-comments'),
    path('applications/<int:application_id>/comments/', ApplicationCommentListCreateView.as_view(), name='application-comments'),
]