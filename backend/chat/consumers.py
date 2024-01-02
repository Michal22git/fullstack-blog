import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from users.models import Profile

from .models import OnlineUser, Chat, Message


class ChatConsumer(AsyncWebsocketConsumer):
    def getUser(self, userId):
        user = User.objects.get(id=userId)
        return Profile.objects.get(user=user)

    def getOnlineUsers(self):
        onlineUsers = OnlineUser.objects.all()
        return [onlineUser.user.id for onlineUser in onlineUsers]

    def addOnlineUser(self, user):
        OnlineUser.objects.create(user=user)

    def deleteOnlineUser(self, user):
        OnlineUser.objects.get(user=user).delete()

    def saveMessage(self, message, userId, roomId):
        profileObj = Profile.objects.get(user=User.objects.get(id=userId))
        chatObj = Chat.objects.get(roomId=roomId)
        chatMessageObj = Message.objects.create(
            chat=chatObj, user=profileObj, message=message
        )
        return {
            'action': 'message',
            'user': userId,
            'roomId': roomId,
            'message': message,
            'userImage': profileObj.avatar_img.url,
            'userName': profileObj.user.username,
            'created_time': str(chatMessageObj.created_time)
        }

    async def sendOnlineUserList(self):
        onlineUserList = await database_sync_to_async(self.getOnlineUsers)()
        chatMessage = {
            "type": "chat_message",
            "message": {
                "action": "onlineUser",
                "userList": onlineUserList
            }
        }
        await self.channel_layer.group_send("onlineUser", chatMessage)

    async def connect(self):
        self.userId = self.scope["url_route"]["kwargs"]["userId"]
        self.user = await database_sync_to_async(self.getUser)(self.userId)
        self.userRooms = await database_sync_to_async(
            list
        )(ChatRoom.objects.filter(member=self.user))

        for room in self.userRooms:
            await self.channel_layer.group_add(
                room.roomId,
                self.channel_name
            )
        await self.channel_layer.group_add("onlineUser", self.channel_name)

        await database_sync_to_async(self.addOnlineUser)(self.user)
        await self.sendOnlineUserList()
        await self.accept()

    async def disconnect(self, close_code):
        await database_sync_to_async(self.deleteOnlineUser)(self.user)
        await self.sendOnlineUserList()
        for room in self.userRooms:
            await self.channel_layer.group_discard(
                room.roomId,
                self.channel_name
            )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json["action"]
        roomId = text_data_json["roomId"]
        chatMessage = {}
        if action == "message":
            message = text_data_json["message"]
            userId = text_data_json["user"]
            chatMessage = await database_sync_to_async(
                self.saveMessage
            )(message, userId, roomId)

        await self.channel_layer.group_send(
            roomId,
            {
                "type": "chat_message",
                "message": chatMessage
            }
        )

    async def chat_message(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps(message))
