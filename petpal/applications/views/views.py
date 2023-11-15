from rest_framework import generics, serializers
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import filters


from ..models import Application
from ..serializers import ApplicationSerializer
from accounts.models import Shelter, PetSeeker
from accounts.serializers import ShelterSerializer, PetSeekerSerializer
from django.contrib.auth.models import User
        
# Create your views here.

class ApplicationListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        # List applications
        applications = Application.objects.all()
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        # Create an application
    
            if request.pet_status == 'Available' and request.user.seeker:

                serializer = ApplicationSerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            #else:
                #return Response({'error': 'You can only apply for available pet listings.'}, status=status.HTTP_400_BAD_REQUEST)



class ApplicationRetrieveUpdateView(APIView):
    permission_classes = [AllowAny]

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
            app_status = request.data.get('app_status')
            if (app_status == 'withdrawn' and request.user.seeker) or (app_status == 'accepted' or 'denied' and request.user.shelter):
                    application.app_status = app_status
                    application.save()
                    serializer = ApplicationSerializer(application)
                    return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                
                    return Response({'error': 'Invalid status update for this application.'}, status=status.HTTP_400_BAD_REQUEST)

        except Application.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

class ApplicationListView(APIView):
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        # Filtering based on user role (shelter or seeker)
        if self.request.user.shelter:
            status_filter = self.request.query_params.get('app_status', '')  # Get status parameter
            # Filter applications for shelters by status
            if status_filter in ['accepted', 'pending', 'denied']:
                queryset = Application.objects.filter(user=self.request.user, app_status=status_filter)
            else:
                queryset = Application.objects.filter(user=self.request.user)
        elif self.request.user.seeker:
            status_filter = self.request.query_params.get('app_status', '')  # Get status parameter
            # Filter applications for seekers by status
            if status_filter in ['accepted', 'pending', 'withdrawn']:
                queryset = Application.objects.filter(user=self.request.user, app_status=status_filter)
            else:
                queryset = Application.objects.filter(user=self.request.user)
        else:
            queryset = Application.objects.none()  # Return empty queryset for other users
        
        # Sorting applications by creation time or last update time
        sort_by = self.request.query_params.get('sort_by')
        if sort_by == 'created_at':
            return queryset.order_by('created_at')
        elif sort_by == 'last_update_time':
            return queryset.order_by('last_update_time')
        else:
            return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)




class ApplicationRetrieveView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, application_id, *args, **kwargs):
        # Retrieve an application
        try:
            application = Application.objects.get(id=application_id)
            serializer = ApplicationSerializer(application)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Application.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

