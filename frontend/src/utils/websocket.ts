import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import type { Message } from '../types';

export class ChatWebSocket {
  private stompClient: Client | null = null;
  private url: string;
  private connected: boolean = false;
  private messageCallback: ((message: Message) => void) | null = null;
  private errorCallback: ((error: string) => void) | null = null;

  constructor(url: string) {
    this.url = url;
  }

connect(onMessage: (message: Message) => void, onError?: (error: string) => void): void {
  this.messageCallback = onMessage;
  this.errorCallback = onError || null;

  // Get username from localStorage
  const username = localStorage.getItem('username') || 'anonymous';

  try {
    const socket = new SockJS(this.url);
    
    this.stompClient = new Client({
      webSocketFactory: () => socket as any,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // Send username in connect headers
      connectHeaders: {
        username: username
      }
    });

      // Set up connection handler
      this.stompClient.onConnect = () => {
        console.log('STOMP WebSocket connected');
        this.connected = true;

        // Subscribe to personal message queue
        if (this.stompClient) {
          this.stompClient.subscribe('/user/queue/messages', (message: IMessage) => {
            try {
              const receivedMessage = JSON.parse(message.body);
              console.log('Received message:', receivedMessage);
              
              if (this.messageCallback) {
                this.messageCallback(receivedMessage);
              }
            } catch (error) {
              console.error('Failed to parse message:', error);
              if (this.errorCallback) {
                this.errorCallback('Failed to parse message');
              }
            }
          });
        }
      };

      // Set up error handler
      this.stompClient.onStompError = (frame) => {
        console.error('STOMP error:', frame);
        this.connected = false;
        if (this.errorCallback) {
          this.errorCallback('Connection error');
        }
      };

      // Set up WebSocket error handler
      this.stompClient.onWebSocketError = (event) => {
        console.error('WebSocket error:', event);
        this.connected = false;
        if (this.errorCallback) {
          this.errorCallback('WebSocket connection error');
        }
      };

      // Set up disconnect handler
      this.stompClient.onDisconnect = () => {
        console.log('STOMP WebSocket disconnected');
        this.connected = false;
      };

      // Activate the connection
      this.stompClient.activate();
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      if (this.errorCallback) {
        this.errorCallback('Failed to connect');
      }
    }
  }

  sendChatMessage(senderUsername: string, recipientUsername: string, content: string): void {
    if (this.stompClient && this.connected) {
      const messageRequest = {
        senderUsername: senderUsername,
        recipientUsername: recipientUsername,
        content: content,
      };

      this.stompClient.publish({
        destination: '/app/send',
        body: JSON.stringify(messageRequest),
      });

      console.log('Message sent:', messageRequest);
    } else {
      console.warn('WebSocket is not connected, cannot send message');
    }
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// WebSocket instance for the chat
let chatWebSocket: ChatWebSocket | null = null;

export const getChatWebSocket = (): ChatWebSocket | null => {
  return chatWebSocket;
};

export const initializeChatWebSocket = (url: string): ChatWebSocket => {
  if (chatWebSocket) {
    chatWebSocket.disconnect();
  }
  
  chatWebSocket = new ChatWebSocket(url);
  return chatWebSocket;
};

export const disconnectChatWebSocket = (): void => {
  if (chatWebSocket) {
    chatWebSocket.disconnect();
    chatWebSocket = null;
  }
};