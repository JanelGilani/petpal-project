from django.urls import path
from . import views

app_name="notifications"
urlpatterns = [ 
    path('<int:pk>/', views.NotificationDetailView.as_view(), name='notification-list'),
    path('', views.NotificationListView.as_view(), name='notification-detail'),
    path('comments/', views.CommentCreateView.as_view(), name='comment-list'),
]