from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Post, Like, Comment
from .serializers import PostSerializer, LikeSerializer, AddCommentSerializer, \
    PostCreateSerializer


class UserPostsView(generics.ListAPIView):
    queryset = Post
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs.get('user')
        user = User.objects.get(username=username)
        return Post.objects.filter(user=user)


class LikePostView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LikeSerializer

    def post(self, request, pk):
        post = Post.objects.get(pk=pk)
        like, created = Like.objects.get_or_create(user=request.user, post=post)

        if created:
            return Response({"message": "Post liked"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Already liked"}, status=status.HTTP_400_BAD_REQUEST)


class UnlikePostView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LikeSerializer

    def delete(self, request, pk):
        try:
            like = Like.objects.get(user=request.user, post=pk)
            like.delete()
            return Response({"message": "Post unliked"}, status=status.HTTP_200_OK)
        except Like.DoesNotExist:
            return Response({"message": "Not liked yet"}, status=status.HTTP_400_BAD_REQUEST)


class CommentPostView(generics.CreateAPIView):
    serializer_class = AddCommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        post_pk = self.kwargs.get('pk')
        post = get_object_or_404(Post, pk=post_pk)
        serializer.save(user=self.request.user, post=post)


class PostsView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]


class PostsCreateView(generics.CreateAPIView):
    serializer_class = PostCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
