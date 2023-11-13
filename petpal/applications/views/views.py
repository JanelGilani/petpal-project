# from rest_framework import generics, serializers
# from rest_framework.permissions import IsAuthenticated
# from .models import Application
# from .serializers import ApplicationSerializer


# class ApplicationListCreateView(generics.ListCreateAPIView):
#     queryset = Application.objects.all()
#     serializer_class = ApplicationSerializer
#     permission_classes = [IsAuthenticated]  # Adjust permissions as needed

#     def perform_create(self, serializer):
#         # Ensure the user can only apply for "available" pet listings
#         pet_listing_id = self.request.data.get('pet_listing')
#         pet_listing = PetListing.objects.get(id=pet_listing_id)
#         if pet_listing.status == 'available':
#             serializer.save(user=self.request.user)
#         else:
#             raise serializers.ValidationError("You can only apply for available pet listings.")
        

# class ApplicationRetrieveUpdateView(generics.RetrieveUpdateAPIView):
#     queryset = Application.objects.all()
#     serializer_class = ApplicationSerializer
#     permission_classes = [IsAuthenticated]  # Adjust permissions as needed

#     def perform_update(self, serializer):
#         # Ensure the user can only update the status of their own application
#         application = self.get_object()
#         if application.user == self.request.user:
#             status = self.request.data.get('status')
#             if (self.request.user.is_shelter and status in ['accepted', 'denied']) or \
#                (self.request.user.is_pet_seeker and status == 'withdrawn'):
#                 serializer.save()
#             else:
#                 raise serializers.ValidationError("Invalid status update for this application.")
#         else:
#             raise serializers.PermissionDenied("You do not have permission to update this application.")
        

# class ApplicationListView(generics.ListAPIView):
#     queryset = Application.objects.all()
#     serializer_class = ApplicationSerializer
#     permission_classes = [IsAuthenticated]  # Adjust permissions as needed

#     def get_queryset(self):
#         # Shelters can only view their own applications
#         if self.request.user.is_shelter:
#             return Application.objects.filter(pet_listing__shelter__user=self.request.user)
#         # Pet seekers can only view their own applications
#         elif self.request.user.is_pet_seeker:
#             return Application.objects.filter(user=self.request.user)
#         return Application.objects.none()

# class ApplicationRetrieveView(generics.RetrieveAPIView):
#     queryset = Application.objects.all()
#     serializer_class = ApplicationSerializer
#     permission_classes = [IsAuthenticated] 



# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Application
from .serializers import ApplicationSerializer
#from .models import PetListing  # Make sure to import the PetListing model

class ApplicationListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # List applications
        applications = Application.objects.all()
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        # Create an application
        #pet_listing_id = request.data.get('pet_listing')
        #try:
            #pet_listing = PetListing.objects.get(id=pet_listing_id)
    
            #if pet_listing.status == 'available':
                serializer = ApplicationSerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save(user=request.user)
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            #else:
         #       return Response({'error': 'You can only apply for available pet listings.'}, status=status.HTTP_400_BAD_REQUEST)
        #except PetListing.DoesNotExist:
          #  return Response({'error': 'Pet listing not found'}, status=status.HTTP_404_NOT_FOUND)


class ApplicationRetrieveUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, application_id, *args, **kwargs):
        # Retrieve an application
        try:
            application = Application.objects.get(id=application_id)
            serializer = ApplicationSerializer(application)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Application.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, application_id, *args, **kwargs):
        # Update the status of an application
        try:
            application = Application.objects.get(id=application_id)
            if application.user == request.user:
                status = request.data.get('status')
                if (request.user.is_shelter and status in ['accepted', 'denied']) or \
                   (request.user.is_pet_seeker and status == 'withdrawn'):
                    serializer = ApplicationSerializer(application, data={'status': status}, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        return Response(serializer.data, status=status.HTTP_200_OK)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'error': 'Invalid status update for this application.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'You do not have permission to update this application.'}, status=status.HTTP_403_FORBIDDEN)
        except Application.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)


class ApplicationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # List applications based on user role
        if request.user.is_shelter:
            applications = Application.objects.filter(pet_listing__shelter__user=request.user)
        elif request.user.is_pet_seeker:
            applications = Application.objects.filter(user=request.user)
        else:
            applications = Application.objects.none()

        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ApplicationRetrieveView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, application_id, *args, **kwargs):
        # Retrieve an application
        try:
            application = Application.objects.get(id=application_id)
            serializer = ApplicationSerializer(application)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Application.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

