from django.urls import path

from .views import UserPostsView, LikePostView, UnlikePostView, CommentPostView, PostsView, PostsCreateView

urlpatterns = [
    path("posts/create/", PostsCreateView.as_view(), name="post-create"),
    path("posts/<str:user>/", UserPostsView.as_view(), name="user-posts"),
    path("posts/", PostsView.as_view(), name="post-all"),
    path("posts/like/<int:pk>/", LikePostView.as_view(), name="post-like"),
    path("posts/unlike/<int:pk>/", UnlikePostView.as_view(), name="post-unlike"),
    path("posts/comment/<int:pk>/", CommentPostView.as_view(), name="post-unlike"),
]
