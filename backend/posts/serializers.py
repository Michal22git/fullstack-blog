from rest_framework import serializers

from .models import Post, Comment, Like
from users.serializers import UserSerializer, ProfileSerializer
from users.models import Profile
from django.contrib.auth.models import User


class LikeSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(source='user.profile')

    class Meta:
        model = Like
        exclude = ['post', 'user']


class CommentSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(source='user.profile')

    class Meta:
        model = Comment
        exclude = ['post', 'user']


class PostSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(source='user.profile')
    likes = LikeSerializer(many=True, source='like_set')
    comments = CommentSerializer(many=True, source='comment_set')
    liked_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Post
        exclude = ['user']

    def get_liked_by_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user = request.user
            return Like.objects.filter(user=user, post=obj).exists()
        return False


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'


class AddCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        exclude = ['user', 'post']


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['description', 'image', 'user', 'created_time']
        read_only_fields = ['user', 'created_time']
