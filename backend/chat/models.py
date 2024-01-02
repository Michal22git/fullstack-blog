import uuid

from django.db import models
from users.models import Profile


class OnlineUser(models.Model):
    user = models.OneToOneField(Profile, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username


class Chat(models.Model):
    roomId = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    member = models.ManyToManyField(Profile)
    name = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = f"Chat {self.pk}"
        super(Chat, self).save(*args, **kwargs)


class Message(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    chat = models.ForeignKey(Chat, on_delete=models.SET_NULL, null=True)
    message = models.TextField()
    created_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.user.username
