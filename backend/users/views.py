from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Profile, Follow
from .serializers import UserRegisterSerializer, MyTokenObtainPairSerializer, ProfileSerializer


class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


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


class UserProfileView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        username = self.kwargs.get('user')
        user = User.objects.get(username=username)
        profile = Profile.objects.get(user=user)
        return profile


class FollowerView(generics.ListAPIView):
    serializer_class = ProfileSerializer

    def get_queryset(self):
        username = self.kwargs['user']  # Pobranie nazwy użytkownika z URL
        user_profile = Profile.objects.get(user__username=username)  # Pobranie profilu użytkownika
        followers = Follow.objects.filter(user=user_profile.user)  # Pobranie followersów dla użytkownika
        return [follower.follower.profile for follower in followers]


class FollowingView(generics.ListAPIView):
    serializer_class = ProfileSerializer

    def get_queryset(self):
        username = self.kwargs['user']  # Pobranie nazwy użytkownika z URL
        user_profile = Profile.objects.get(user__username=username)  # Pobranie profilu użytkownika
        following = Follow.objects.filter(follower=user_profile.user)  # Pobranie obserwowanych przez użytkownika
        return [followed.user.profile for followed in following]
