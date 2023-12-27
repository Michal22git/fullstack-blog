from PIL import Image
from django.contrib.auth.models import User
from django.test import TestCase

from users.models import Profile, Follow


class ProfileModelTest(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user(username="Michal", password="ZAQ!@WSX")
        self.test_profile = Profile.objects.create(user=self.test_user, description="Test description of test user")

    def test_profile_str(self):
        expected_str = f"{self.test_profile.user.username} profile"
        self.assertEqual(str(self.test_profile), expected_str)

    def test_image_resize(self):
        profile = self.test_profile
        img_path = profile.image.path

        profile.save()

        img = Image.open(img_path)
        self.assertTrue(img.height <= 300 and img.width <= 300)


class FollowerModelTest(TestCase):
    def setUp(self):
        self.user_1 = User.objects.create_user(username='user1', password='testpass')
        self.user_2 = User.objects.create_user(username='user2', password='testpass')
        self.profile_1 = Profile.objects.create(user=self.user_1)
        self.profile_2 = Profile.objects.create(user=self.user_2)

    def test_follow(self):
        follow = Follow.objects.create(user=self.user_1, follower=self.user_2)

        self.assertEqual(Follow.objects.filter(user=self.user_1).count(), 1)
        self.assertEqual(Follow.objects.filter(follower=self.user_2).count(), 1)

    def test_unfollow(self):
        follow = Follow.objects.create(user=self.user_1, follower=self.user_2)

        follow.delete()

        self.assertEqual(Follow.objects.filter(user=self.user_1).count(), 0)
        self.assertEqual(Follow.objects.filter(follower=self.user_2).count(), 0)
