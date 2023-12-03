from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Profile


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email

        return token


class UserRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="This username is already in use."
            )
        ]
    )

    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="This email is already in use."
            )
        ]
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'date_joined']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    image = serializers.SerializerMethodField('get_image_url')

    class Meta:
        model = Profile
        fields = ['user', 'description', 'image', 'followers_count', 'following_count']

    def get_image_url(self, obj):
        return self.context['request'].build_absolute_uri(obj.image.url)
