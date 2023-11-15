from django.forms import ImageField
from rest_framework.serializers import ModelSerializer, DateTimeField, ListField, \
    PrimaryKeyRelatedField, HyperlinkedRelatedField
from . import models

class PetsSerializer(ModelSerializer):
    shelter = PrimaryKeyRelatedField(read_only=True)
    # shelter = HyperlinkedRelatedField(read_only=True, view_name='shelter-detail')
    image = ImageField(max_length=None, required=False)

    class Meta:
        model = models.Pets
        fields = '__all__'

class PetsListSerializer(ModelSerializer):
    shelter = PrimaryKeyRelatedField(read_only=True)
    # shelter = HyperlinkedRelatedField(read_only=True, view_name='shelter-detail')
    image = ImageField(max_length=None, required=False)

    class Meta:
        model = models.Pets
        fields = ['id', 'name', 'shelter', 'breed', 'age', 'size', 'color', 'gender', 'date_added', 'species', 'status']

