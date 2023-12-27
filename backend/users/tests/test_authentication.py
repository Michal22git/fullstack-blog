from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


class TestAPIAuthentication(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='Michal', email='test@example.com', password='ZAQ!2wsx')

    def test_token_obtain_pair(self):
        response = self.client.post(
            reverse('token_obtain_pair'),
            data={
                'username': 'Michal',
                'password': 'ZAQ!2wsx'
            },
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_token_refresh(self):
        refresh = RefreshToken.for_user(self.user)

        response = self.client.post(
            reverse('token_refresh'),
            data={
                'refresh': str(refresh)
            },
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_credentials(self):
        response = self.client.post(
            reverse('token_obtain_pair'),
            data={
                'username': 'nonexistent_user',
                'password': 'incorrect_password'
            },
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_missing_refresh_token(self):
        response = self.client.post(
            reverse('token_refresh'),
            data={},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
