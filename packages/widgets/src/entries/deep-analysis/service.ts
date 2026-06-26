import type { Message } from '@ai-sdk/react';
import { nanoid } from 'nanoid';
import {
  ERequestMessageType,
  EAssistantMessageType,
  type IWebSocketResponseMessage,
  type IDialogResponseMessage,
  type IDataAnalysisResponseMessage,
  type IErrorResponseMessage,
} from '@/types/deep-analysis/message';
import { DataAnalysisMessage } from './message/model';

type Listener = () => void;

const formatMessage = (msg: Partial<Message>): Message => {
  if (!msg.id) {
    msg.id = nanoid(10);
  }
  if (msg.content) {
    msg.parts = [
      {
        type: 'text',
        text: msg.content,
      },
    ];
  } else {
    msg.parts = [];
  }
  return {
    ...msg,
  } as Message;
};

// 定义状态类型
export interface DeepAnalysisState {
  conversationId: string;
  messages: Message[];
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  error: string;
}

export class DeepAnalysisService {
  private _conversationId: string = '';
  private _messages: Message[] = [];
  private _status: 'submitted' | 'streaming' | 'ready' | 'error' = 'ready';
  private _error: string = '';
  private socket!: WebSocket;
  private listeners: Set<Listener> = new Set();
  private _cachedSnapshot: DeepAnalysisState | null = null;

  private _socketConnectionStatus: 'connected' | 'connecting' | 'disconnected' = 'disconnected';

  private _wsEndpoint: string;

  private _alivePingInterval: any = null;

  constructor(wsEndpoint: string = '') {
    this._wsEndpoint = wsEndpoint || '/ai-agent/ws/chat';
    (window as any)['das'] = this;
  }

  async connect(reconnect = false) {
    if (this._socketConnectionStatus !== 'disconnected') {
      return;
    }
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

    this._socketConnectionStatus = 'connecting';
    this.socket = new WebSocket(`${protocol}://${window.location.host}${this._wsEndpoint}`);

    return new Promise((resolve, reject) => {
      this.socket.onopen = () => {
        console.log('WebSocket connection opened');
        this._socketConnectionStatus = 'connected';
        if (reconnect) {
          console.log('reconnect');
          this.socket.send(
            JSON.stringify({
              type: ERequestMessageType.COMMAND,
              payload: {
                conversationId: this._conversationId,
                command: 'reconnect',
              },
            }),
          );
        } else {
          this.socket.send('PING');
        }
        this._alivePingInterval = setInterval(() => {
          this.socket.send('PING');
        }, 3008);
        resolve(true);
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket connection closed', event);
        this._socketConnectionStatus = 'disconnected';
        clearInterval(this._alivePingInterval);
        this._alivePingInterval = null;
        if (event.code === 1006 || event.code === 3600) {
          setTimeout(() => {
            this.connect(true);
          }, 100);
        }
      };

      this.socket.onerror = (error) => {
        this.socket.close(1000);
        this._socketConnectionStatus = 'disconnected';
        console.error('WebSocket error:', error);
        clearInterval(this._alivePingInterval);
        this._alivePingInterval = null;
        reject(error);
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as IWebSocketResponseMessage;
          if (data.conversationId && !this._conversationId) {
            this.conversationId = data.conversationId;
          }

          // merge or new message
          if (data.type === EAssistantMessageType.NORMAL) {
            this.handleDialogResponse(data);
          } else if (data.type === EAssistantMessageType.ANALYSIS) {
            this.handleDataAnalysisResponse(data);
          } else if (data.type === EAssistantMessageType.ERROR) {
            this.handleErrorResponse(data);
          } else if (data.type === EAssistantMessageType.LOG) {
            console.log('[Agent Log] ', data);
          }
        } catch {
          // ignore
        }
      };
    });
  }

  close() {
    try {
      this.socket.close(1000);
      this._socketConnectionStatus = 'disconnected';
      this.socket = null as any;
    } catch (e) {
      // ignore
    }
  }

  // Getter and setter for conversationId
  get conversationId(): string {
    return this._conversationId;
  }

  set conversationId(value: string) {
    this._conversationId = value;
    this.emitChange();
  }

  // Getter and setter for messages
  get messages(): Message[] {
    return this._messages;
  }

  set messages(value: Message[]) {
    this._messages = value.map(formatMessage);
    this.emitChange();
  }

  async submit() {
    this._status = 'submitted';
    this.emitChange();

    await this.connect();

    this.socket.send(
      JSON.stringify({
        type: ERequestMessageType.QUERY,
        payload: {
          conversationId: this._conversationId,
          messages: this._messages,
        },
      }),
    );
  }

  stop() {
    this._status = 'ready';
    this.emitChange();

    this.socket.send(
      JSON.stringify({
        type: ERequestMessageType.COMMAND,
        payload: {
          conversationId: this._conversationId,
          command: 'stop',
        },
      }),
    );
  }

  // Add a message to the messages array
  addMessage(message: Omit<Message, 'id'>): void {
    this._messages = [
      ...this._messages,
      formatMessage({
        ...message,
      }),
    ];
    this.emitChange();
  }

  // Update a message in the messages array
  updateMessage(id: string, updatedMessage: Partial<Message>): void {
    this._messages = this._messages.map((msg) =>
      msg.id === id ? formatMessage({ ...msg, ...updatedMessage }) : msg,
    );
    this._messages = [...this._messages];
    this.emitChange();
  }

  // Subscribe to changes
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Notify all listeners of changes
  private emitChange(): void {
    // 当状态变化时，清除缓存的快照
    this._cachedSnapshot = null;
    for (const listener of this.listeners) {
      listener();
    }
  }

  // Get the current state snapshot
  getSnapshot(): DeepAnalysisState {
    // 如果有缓存的快照，直接返回
    if (this._cachedSnapshot) {
      return this._cachedSnapshot;
    }

    // 创建新的快照并缓存
    this._cachedSnapshot = {
      conversationId: this._conversationId,
      messages: this._messages,
      status: this._status,
      error: this._error,
    };

    return this._cachedSnapshot;
  }

  // socket message handlers
  private handleDialogResponse(data: IDialogResponseMessage) {
    this._status = data.payload.stop ? 'ready' : 'streaming';
    const msgId = data.messageId;
    let msg = this._messages.find((msg) => msg.id === msgId);
    if (msg) {
      msg.content += data.payload.token;
      this.updateMessage(msgId, msg);
    } else {
      msg = {
        id: msgId,
        role: 'assistant',
        content: data.payload.token,
      };
      this.addMessage(msg);
    }
  }

  private handleDataAnalysisResponse(data: IDataAnalysisResponseMessage) {
    if (data.payload.messageTag === 'end') {
      this._status = 'ready';
      this.close();
      this.emitChange();
      return;
    }

    const msg = this._messages.find((msg) => msg.id === data.messageId);
    if (msg instanceof DataAnalysisMessage) {
      msg.consumeSocketMessage(data);
    } else if (msg) {
      this._messages = this._messages.map((item) => {
        if (item.id === data.messageId) {
          const newMsg = new DataAnalysisMessage(data.messageId);
          newMsg.consumeSocketMessage(data);
          return newMsg;
        }
        return item;
      });
    } else {
      const newMsg = new DataAnalysisMessage(data.messageId);
      newMsg.consumeSocketMessage(data);
      this._messages = [...this._messages, newMsg];
    }
    this.emitChange();
  }

  private handleErrorResponse(data: IErrorResponseMessage) {
    this._error = data.payload?.message;
    this._status = 'error';
    this.emitChange();
  }
}
