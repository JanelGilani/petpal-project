from django.urls import path
from .views import ApplicationListCreateView, ApplicationRetrieveUpdateView, ApplicationListView, ApplicationRetrieveView


app_name="applications"
urlpatterns = [ 
    # path('login/', views.LoginView.as_view(), name="login"),
    # path('logout/', views.logout, name="logout"),
     path('', ApplicationListCreateView.as_view(), name='application-list-create'),

    # Retrieve and Update a specific Application
    path('<int:application_id>/', ApplicationRetrieveUpdateView.as_view(), name='application-retrieve-update'),

    # List Applications based on user role
    path('list/', ApplicationListView.as_view(), name='application-list'),

    # Retrieve a specific Application
    path('<int:application_id>/detail/', ApplicationRetrieveView.as_view(), name='application-retrieve'),

]