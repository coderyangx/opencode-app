import { request } from '../lib/request';

export interface Conversation {
  id: string;
  title: string;
  model: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  parts: unknown[];
  metadata: Record<string, unknown>;
  /** 'done' | 'streaming' | 'error' | 'interrupted' */
  status: string;
  created_at: string;
}

export interface Model {
  id: string;
  label: string;
}

export interface UploadedFile {
  url: string;
  key: string;
  name: string;
  mimeType: string;
}

export const chatApi = {
  getConversations: () => request.get<Conversation[]>('/api/conversations'),

  createConversation: (model?: string) =>
    request.post<Conversation>('/api/conversations/create', { model }),

  updateConversation: (id: string, patch: { title?: string; model?: string }) =>
    request.post<Conversation>('/api/conversations/update', { id, ...patch }),

  deleteConversation: (id: string) => request.post<void>('/api/conversations/delete', { id }),

  pinConversation: (id: string, pinned: boolean) =>
    request.post<Conversation>('/api/conversations/pin', { id, pinned }),

  getMessages: (conversationId: string) =>
    request.get<ChatMessage[]>(`/api/conversations/${conversationId}/messages`),

  getModels: () => request.get<Model[]>('/api/models'),

  /** 上传附件到 Supabase Storage，返回公开 URL */
  uploadFile: (file: File): Promise<UploadedFile> => {
    const form = new FormData();
    form.append('file', file);
    return request.postForm<UploadedFile>('/api/file/upload', form);
  }
};
