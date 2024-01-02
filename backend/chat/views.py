from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response

from .models import Chat, OnlineUser, Message
from .serializers import ChatSerializer, OnlineUserSerializer, MessageSerializer


class IsChatParticipant(BasePermission):
    def has_permission(self, request, view):
        room_id = view.kwargs.get('roomId')
        chat = get_object_or_404(Chat, roomId=room_id)
        return request.user.profile in chat.member.all()


class ActiveUserView(generics.ListAPIView):
    serializer_class = OnlineUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return OnlineUser.objects.all()


class UserChatView(generics.ListAPIView):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user.profile
        return Chat.objects.filter(member=user)


class CreateChatView(generics.CreateAPIView):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, username, *args, **kwargs):
        user = self.request.user
        other_user = get_object_or_404(User, username=username)

        existing_chat = Chat.objects.filter(member=user.profile).filter(member=other_user.profile).first()

        if existing_chat:
            return Response({"message": "Chat already exists"}, status=status.HTTP_400_BAD_REQUEST)

        new_chat = Chat.objects.create()
        new_chat.member.add(user.profile)
        new_chat.member.add(other_user.profile)
        new_chat.save()

        serializer = self.get_serializer(new_chat)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ChatMessageView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated, IsChatParticipant]

    def get_queryset(self):
        room_id = self.kwargs['roomId']
        return Message.objects.filter(chat__roomId=room_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
