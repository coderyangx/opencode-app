import { ActionButton } from '@/components/ui/Button';
import { SideSheet, TextArea } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPanel({
  visible,
  onClose,
  onSave
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (patch: { system_prompt?: string }) => Promise<void>;
}) {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({ system_prompt: systemPrompt });
      toast.success('已保存');
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <SideSheet
      title='对话设置'
      visible={visible}
      onCancel={onClose}
      width={360}
      className='chat-settings-panel'
      footer={
        <div className='flex justify-end gap-2'>
          <ActionButton onClick={onClose} variant='default'>
            取消
          </ActionButton>
          <ActionButton loading={saving} onClick={handleSave} variant='primary'>
            保存
          </ActionButton>
        </div>
      }
    >
      <div className='flex flex-col gap-2.5'>
        <label className='text-sm font-medium text-gray-800'>系统提示词</label>
        <TextArea
          placeholder='给 AI 设定角色或背景，留空使用默认'
          value={systemPrompt}
          onChange={setSystemPrompt}
          rows={6}
          autosize
        />
        <p className='text-xs text-gray-400'>仅对本次对话生效，切换对话后重置</p>
      </div>
    </SideSheet>
  );
}
