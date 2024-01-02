from django.contrib import admin

from .models import OnlineUser, Chat, Message

admin.site.register(OnlineUser)
admin.site.register(Chat)
admin.site.register(Message)
