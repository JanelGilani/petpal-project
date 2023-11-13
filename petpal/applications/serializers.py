class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'

# class CustomUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser  # Replace with your actual user model
#         fields = '__all__'

# class PetListingSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PetListing  # Replace with your actual pet listing model
#         fields = '__all__'