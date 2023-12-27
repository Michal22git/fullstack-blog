from datetime import datetime

from django.contrib.auth.models import User
from django.test import TestCase

from posts.models import Post, Like, Comment


class PostModelTest(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user(username="Michal", password="ZAQ!2wsx")
        self.test_post = Post.objects.create(user=self.test_user, description="Test description")

    def test_post_creation(self):
        self.assertEqual(self.test_post.user, self.test_user)
        self.assertEqual(self.test_post.description, "Test description")

    def test_post_ordering(self):
        post_2 = Post.objects.create(user=self.test_user, description="Another test", created_time=datetime(2023, 1, 1))
        posts = Post.objects.all()
        self.assertEqual(posts[0].created_time, post_2.created_time)
        self.assertEqual(posts[1].created_time, self.test_post.created_time)


class LikeModelTest(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user(username="Michal", password="ZAQ!2wsx")
        self.test_post = Post.objects.create(user=self.test_user, description="Test description")
        self.test_like = Like.objects.create(user=self.test_user, post=self.test_post)

    def test_like_creation(self):
        self.assertEqual(self.test_like.user, self.test_user)
        self.assertEqual(self.test_like.post, self.test_post)


class CommentModelTest(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user(username="Michal", password="ZAQ!2wsx")
        self.test_post = Post.objects.create(user=self.test_user, description="Test description")
        self.test_comment = Comment.objects.create(user=self.test_user, post=self.test_post, content="Test comment very long")

    def test_comment_creation(self):
        self.assertEqual(self.test_comment.user, self.test_user)
        self.assertEqual(self.test_comment.post, self.test_post)
        self.assertEqual(self.test_comment.content, "Test comment very long")
