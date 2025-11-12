import type { Message } from '../types';

export interface WebSocketMessage {
  type: 'MESSAGE' | 'CONNECT' | 'DISCONNECT' | 'ERROR';
  data?: any;
}

export class ChatWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(url: string) {
    this.url = url;
  }

  connect(onMessage: (message: Message) => void, onError?: (error: string) => void): void {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        
        // Send connection message
        this.send({
          type: 'CONNECT',
          data: { timestamp: new Date().toISOString() }
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const wsMessage: WebSocketMessage = JSON.parse(event.data);
          
          if (wsMessage.type === 'MESSAGE' && wsMessage.data) {
            onMessage(wsMessage.data);
          } else if (wsMessage.type === 'ERROR' && onError) {
            onError(wsMessage.data?.message || 'Unknown error');
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
          if (onError) {
            onError('Failed to parse message');
          }
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnect(onMessage, onError);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) {
          onError('Connection error');
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      if (onError) {
        onError('Failed to connect');
      }
    }
  }

  private reconnect(onMessage: (message: Message) => void, onError?: (error: string) => void): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect(onMessage, onError);
    }, delay);
  }

  send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  sendChatMessage(message: Message): void {
    this.send({
      type: 'MESSAGE',
      data: message
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.send({
        type: 'DISCONNECT',
        data: { timestamp: new Date().toISOString() }
      });
      
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
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
