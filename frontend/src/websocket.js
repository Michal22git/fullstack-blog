import { useEffect, useRef } from 'react';
import { SOCKET_URL } from './settings';

const useWebSocket = () => {
  const callbacks = useRef({});
  const socketRef = useRef(null);

  const connect = (chatUrl) => {
    const path = `${SOCKET_URL}/ws/chat/${chatUrl}/`;
    socketRef.current = new WebSocket(path);
    socketRef.current.onopen = () => {
      console.log("WebSocket open");
    };
    socketRef.current.onmessage = (e) => {
      socketNewMessage(e.data);
    };
    socketRef.current.onerror = (e) => {
      console.log(e.message);
    };
    socketRef.current.onclose = () => {
      console.log("WebSocket closed let's reopen");
      connect();
    };
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  const socketNewMessage = (data) => {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(callbacks.current).length === 0) {
      return;
    }
    if (command === 'messages') {
      callbacks.current[command](parsedData.messages);
    }
    if (command === 'new_message') {
      callbacks.current[command](parsedData.message);
    }
  };

  const fetchMessages = (username, chatId) => {
    sendMessage({
      command: 'fetch_messages',
      username: username,
      chatId: chatId,
    });
  };

  const newChatMessage = (message) => {
    sendMessage({
      command: 'new_message',
      from: message.from,
      message: message.content,
      chatId: message.chatId,
    });
  };

  const addCallbacks = (messagesCallback, newMessageCallback) => {
    callbacks.current['messages'] = messagesCallback;
    callbacks.current['new_message'] = newMessageCallback;
  };

  const sendMessage = (data) => {
    try {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ ...data }));
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const state = () => {
    return socketRef.current ? socketRef.current.readyState : WebSocket.CLOSED;
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return { connect, disconnect, fetchMessages, newChatMessage, addCallbacks, state };
};

const WebSocketInstance = useWebSocket();

export default WebSocketInstance;
