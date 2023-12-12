from django.db import models
from django.contrib.auth.models import User


class Post(models.Model):
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='posts', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_time']

    def __str__(self):
        return f'{self.user} - {self.created_time}'


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_time']

    def __str__(self):
        return f'{self.user} - {self.post}'


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_time']

    def __str__(self):
        return f"{self.user} - {self.post}"
