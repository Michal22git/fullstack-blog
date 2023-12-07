from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Profile, Follow


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
    followed = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['user', 'description', 'image', 'followers_count', 'following_count', 'followed']

    def get_image_url(self, obj):
        return self.context['request'].build_absolute_uri(obj.image.url)

    def get_followed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user = request.user
            return Follow.objects.filter(user=obj.user, follower=user).exists()
        return False


class EditProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    email = serializers.CharField()

    class Meta:
        model = Profile
        fields = ['description', 'username', 'email']

    def validate(self, data):
        user = self.context['request'].user
        username = data.get('username', user.username)
        email = data.get('email', user.email)

        username_exists = User.objects.exclude(pk=user.pk).filter(username=username).exists()
        email_exists = User.objects.exclude(pk=user.pk).filter(email=email).exists()

        if username_exists:
            raise serializers.ValidationError("This username is already in use.")
        if email_exists:
            raise serializers.ValidationError("This email is already in use.")

        return data


class UpdatePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['image']
