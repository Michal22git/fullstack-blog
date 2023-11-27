from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator


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
