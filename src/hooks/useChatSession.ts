import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { chatApi, type Conversation } from '../services/chatApi';

export function useChatSession() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await chatApi.getConversations();
      setConversations(list);
      return list;
    } catch {
      // 错误已在 request.ts 统一 Toast，这里静默
      return [] as Conversation[];
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (model?: string) => {
    const conv = await chatApi.createConversation(model);
    setConversations((prev) => [conv, ...prev]);
    return conv;
  }, []);

  const rename = useCallback(async (id: string, title: string) => {
    const updated = await chatApi.updateConversation(id, { title });
    setConversations((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }, []);

  const changeModel = useCallback(async (id: string, model: string) => {
    const updated = await chatApi.updateConversation(id, { model });
    setConversations((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }, []);

  const deleteConv = useCallback(async (id: string) => {
    await chatApi.deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    toast.success('对话已删除');
  }, []);

  const pin = useCallback(async (id: string, pinned: boolean) => {
    // 乐观更新：立即反映在 UI
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, pinned } : c)));
    try {
      const updated = await chatApi.pinConversation(id, pinned);
      setConversations((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch {
      // 失败回滚
      setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: !pinned } : c)));
      toast.error('操作失败');
    }
  }, []);

  // 标题生成后从服务端刷新单条（服务端 generateTitle 异步执行）
  const refreshOne = useCallback(async (id: string) => {
    try {
      const list = await chatApi.getConversations();
      setConversations(list);
    } catch {
      /* silent */
    }
  }, []);

  return {
    conversations,
    loading,
    load,
    create,
    rename,
    changeModel,
    deleteConv,
    pin,
    refreshOne
  };
}
