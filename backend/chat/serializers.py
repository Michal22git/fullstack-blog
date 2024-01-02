from rest_framework import serializers
from users.serializers import ProfileSerializer

from .models import OnlineUser, Chat, Message


class OnlineUserSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(many=True, read_only=True)

    class Meta:
        model = OnlineUser
        fields = "__all__"


class ChatSerializer(serializers.ModelSerializer):
    member = ProfileSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(read_only=True)

    class Meta:
        model = Message
        fields = '__all__'
