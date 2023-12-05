from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Profile, Follow
from .serializers import UserRegisterSerializer, MyTokenObtainPairSerializer, ProfileSerializer, EditProfileSerializer, UpdatePictureSerializer


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
        username = self.kwargs['user']
        user_profile = Profile.objects.get(user__username=username)
        followers = Follow.objects.filter(user=user_profile.user)
        return [follower.follower.profile for follower in followers]


class FollowingView(generics.ListAPIView):
    serializer_class = ProfileSerializer

    def get_queryset(self):
        username = self.kwargs['user']
        user_profile = Profile.objects.get(user__username=username)
        following = Follow.objects.filter(follower=user_profile.user)
        return [followed.user.profile for followed in following]


class UpdateProfileView(generics.UpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = EditProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        user = self.request.user

        new_username = request.data.get('username', None)
        if new_username and new_username != user.username:
            user.username = new_username
            user.save()

        new_email = request.data.get('email', None)
        if new_email and new_email != user.email:
            user.email = new_email
            user.save()

        serializer.save()
        return Response(serializer.data)


class UpdatePictureView(generics.UpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = UpdatePictureSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile
