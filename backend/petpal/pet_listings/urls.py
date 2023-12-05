from django.urls import path
from . import views

app_name = "pets_listings"
urlpatterns = [    
    path('', views.PetCreateView.as_view(), name="create_pet"), 
    path('all/', views.PetListView.as_view(), name="list_pets"),   
    path('search/', views.PetSearchView.as_view(), name="search_pets"),
    path('shelter/<int:shelter_id>/', views.ShelterPetListView.as_view(), name="shelter_pets"),
    path('details/<int:pet_id>/', views.pet_detail, name="pet_detail"),
    path('<int:pet_id>/', views.pet_update, name="update_pet"),
]