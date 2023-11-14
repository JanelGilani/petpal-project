# accounts/urls.py

from django.urls import path
from .views import ShelterCreateView, ShelterRegistrationView, PetSeekerRegistrationView, LoginView, ShelterProfileView, \
    PetSeekerProfileView, ListSheltersView, ShelterDeleteView, PetSeekerDeleteView

app_name = 'accounts'

urlpatterns = [
    path('shelters/', ShelterCreateView.as_view(), name='shelter-register'),
    path('petseekers/', PetSeekerRegistrationView.as_view(), name='petseeker-register'),
    path('login/', LoginView.as_view(), name='login'),
    path('shelters/profile/<str:username>/', ShelterProfileView.as_view(), name='shelter-profile'),
    path('petseekers/profile/<str:username>/', PetSeekerProfileView.as_view(), name='petseeker-profile'),
    path('shelters/', ListSheltersView.as_view(), name='list-shelters'),
    path('shelters/<str:username>/', ShelterDeleteView.as_view(), name='shelter-detail'),  # Changed path
    path('petseekers/<str:username>/', PetSeekerDeleteView.as_view(), name='petseeker-detail'),  # Changed path
]
