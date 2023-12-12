from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Profile, Follow
from .serializers import UserRegisterSerializer, MyTokenObtainPairSerializer, \
    ProfileSerializer, EditProfileSerializer, UpdatePictureSerializer


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


class FollowView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user):
        user_to_follow = get_object_or_404(User, username=user)
        current_user = self.request.user

        if user_to_follow == current_user:
            return Response({"error": "You selected yourself"}, status=status.HTTP_400_BAD_REQUEST)

        is_following = Follow.objects.filter(user=user_to_follow, follower=current_user).exists()
        if is_following:
            return Response({"error": "You already follow this user"}, status=status.HTTP_400_BAD_REQUEST)

        follow = Follow.objects.create(user=user_to_follow, follower=current_user)
        follow.save()

        return Response({"success": f"{user_to_follow.username} followed"}, status=status.HTTP_201_CREATED)


class UnfollowView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, user):
        user_to_unfollow = get_object_or_404(User, username=user)
        current_user = self.request.user

        if user_to_unfollow == current_user:
            return Response({"error": "You selected yourself"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            follow_instance = Follow.objects.get(user=user_to_unfollow, follower=current_user)
            follow_instance.delete()
            return Response({"success": f"{user_to_unfollow.username} unfollowed"}, status=status.HTTP_200_OK)
        except Follow.DoesNotExist:
            return Response({"error": "You dont follow this user"}, status=status.HTTP_400_BAD_REQUEST)


class SearchView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.kwargs.get('user')
        if user:
            return Profile.objects.filter(user__username__icontains=user)
        else:
            return Profile.objects.none()
