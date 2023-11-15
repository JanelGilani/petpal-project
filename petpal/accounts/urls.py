# accounts/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import  ShelterRegistrationView, PetSeekerRegistrationView, ShelterProfileView, \
    PetSeekerProfileView, ListSheltersView, ShelterDeleteView, PetSeekerDeleteView

app_name = 'accounts'

urlpatterns = [
    path('shelters/', ShelterRegistrationView.as_view(), name='shelter-register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('petseekers/', PetSeekerRegistrationView.as_view(), name='petseeker-register'),
    path('shelters/profile/<str:username>/', ShelterProfileView.as_view(), name='shelter-profile'),
    path('petseekers/profile/<str:username>/', PetSeekerProfileView.as_view(), name='petseeker-profile'),
    path('shelters/', ListSheltersView.as_view(), name='list-shelters'),
    path('shelters/<str:username>/', ShelterDeleteView.as_view(), name='shelter-detail'),  # Changed path
    path('petseekers/<str:username>/', PetSeekerDeleteView.as_view(), name='petseeker-detail'),  # Changed path
]
