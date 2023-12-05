# accounts/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import  ShelterRegistrationView, PetSeekerRegistrationView, ShelterProfileView, \
    PetSeekerProfileView, ListSheltersView, ShelterUpdateView, PetSeekerUpdateView, UserInfoView

app_name = 'accounts'

urlpatterns = [
    path('userinfo/', UserInfoView.as_view(), name='user-info'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('shelters/', ShelterRegistrationView.as_view(), name='shelter-register'),
    path('petseekers/', PetSeekerRegistrationView.as_view(), name='petseeker-register'),
    path('shelters/<str:username>/', ShelterUpdateView.as_view(), name='shelter-update'),
    path('petseekers/<str:username>/', PetSeekerUpdateView.as_view(), name='petseeker-profile'),
    path('shelters/profile/<str:username>/', ShelterProfileView.as_view(), name='shelter-profile'),
    path('petseekers/profile/<str:username>/', PetSeekerProfileView.as_view(), name='petseeker-profile'),
    path('all_shelters/', ListSheltersView.as_view(), name='list-shelters'),

]