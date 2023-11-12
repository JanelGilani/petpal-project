# accounts/urls.py

from django.urls import path
from .views import ShelterRegistrationView, PetSeekerRegistrationView, LoginView, ShelterProfileView, PetSeekerProfileView

app_name = 'accounts'

urlpatterns = [
    path('shelters/', ShelterRegistrationView.as_view(), name='shelter-register'),
    path('petseekers/', PetSeekerRegistrationView.as_view(), name='petseeker-register'),
    path('login/', LoginView.as_view(), name='login'),
    path('shelters/profile/', ShelterProfileView.as_view(), name='shelter-profile'),
    path('petseekers/profile/', PetSeekerProfileView.as_view(), name='petseeker-profile'),
]
