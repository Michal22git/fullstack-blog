from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from .serializers import UserRegisterSerializer
from .models import Profile


class UserRegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create(
                username=serializer.validated_data['username'],
                email=serializer.validated_data['email']
            )
            user.set_password(serializer.validated_data['password'])
            user.save()

            profile = Profile(user=user)
            profile.save()

            response_data = {
                "data": {
                    "username": user.username,
                    "email": user.email,
                    "profile_id": profile.id
                }
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        response_data = {
            "errors": serializer.errors
        }
        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
