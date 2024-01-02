from django.urls import path

from .views import ActiveUserView, UserChatView, CreateChatView, ChatMessageView

urlpatterns = [
    path('active/', ActiveUserView.as_view(), name="active-users"),
    path('my-chats/', UserChatView.as_view(), name='user-chat'),
    path('create/<str:username>/', CreateChatView.as_view(), name="create-chat"),
    path('<str:roomId>/messages/', ChatMessageView.as_view(), name="chat-messages")
]
