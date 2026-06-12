/**
 * src/components/ui/Modal.tsx
 *
 * 通用确认弹窗，基于 Semi Modal 但完全自定义 footer 按钮，
 * 避免 Semi 默认蓝色主题。
 */
import React from 'react';
import { Modal } from '@douyinfe/semi-ui';
import { ActionButton } from './Button';

interface AppModalProps {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  /** 确认按钮文字，默认 '确认' */
  confirmText?: string;
  /** 取消按钮文字，默认 '取消' */
  cancelText?: string;
  /** 确认按钮变体，默认 'primary' */
  confirmVariant?: 'primary' | 'danger';
  /** 弹窗宽度，默认 360 */
  width?: number;
}

export default function AppModal({
  visible,
  title,
  children,
  onCancel,
  onConfirm,
  confirmText = '确认',
  cancelText = '取消',
  confirmVariant = 'primary',
  width = 360
}: AppModalProps) {
  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      footer={
        <div className='flex justify-end gap-2'>
          <ActionButton variant='default' onClick={onCancel}>
            {cancelText}
          </ActionButton>
          <ActionButton variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </ActionButton>
        </div>
      }
      width={width}
      centered
    >
      {children}
    </Modal>
  );
}
