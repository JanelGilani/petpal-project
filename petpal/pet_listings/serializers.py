from rest_framework.serializers import ModelSerializer, DateTimeField, ListField, \
    PrimaryKeyRelatedField, HyperlinkedRelatedField
from . import models

class PetsSerializer(ModelSerializer):
    shelter = PrimaryKeyRelatedField(read_only=True)
    # shelter = HyperlinkedRelatedField(read_only=True, view_name='shelter-detail')
    class Meta:
        model = models.Pets
        fields = '__all__'

class PetsListSerializer(ModelSerializer):
    shelter = PrimaryKeyRelatedField(read_only=True)
    # shelter = HyperlinkedRelatedField(read_only=True, view_name='shelter-detail')
    class Meta:
        model = models.Pets
        fields = ['name', 'age', 'species', 'breed', 'date_added', 'status', 'shelter', 'size', 'color']

