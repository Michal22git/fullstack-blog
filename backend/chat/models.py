from django.db import models
from users.models import Profile


class Message(models.Model):
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE)
    content = models.TextField()
    created_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.owner.user.username

    def last_30_message(self):
        return Message.objects.order_by('-created_time').all()[:30]
