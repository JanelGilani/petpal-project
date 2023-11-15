from rest_framework import serializers
from ..models import Comment


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'text', 'created_at', 'user', 'shelter', 'application']