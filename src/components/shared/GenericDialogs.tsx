// components/shared/GenericDialogs.tsx

'use client';

import React, { ComponentType, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

// 定义通用的对话框状态类型
export interface GenericDialogState<T = any> {
  type: string | null; // 对话框的唯一标识符 (例如: 'init', 'distribute', 'detail')
  data: T | null; // 传入对话框的数据 (例如: 详情数据)
  open: boolean;
}

// 弹窗配置接口
export interface DialogConfig {
  title: string;
  description?: string;
  component: ComponentType<any>;
  className?: string;
  props?: Record<string, any>; // ✅ 新增：组件所需的 props
}

interface GenericDialogsProps {
  dialogState: GenericDialogState;
  onClose: () => void; // ✅ 简化：移除 callback 参数
  dialogs: Record<string, DialogConfig>; // ✅ 重命名：configs → dialogs
}

export function GenericDialogs({
  dialogState,
  onClose,
  dialogs
}: GenericDialogsProps) {
  const currentConfig = useMemo(() => {
    if (!dialogState.type) return null;
    return dialogs[dialogState.type];
  }, [dialogState.type, dialogs]);

  if (!currentConfig) {
    return null;
  }

  const ComponentToRender = currentConfig.component;

  return (
    <Dialog open={dialogState.open} onOpenChange={onClose}>
      <DialogContent className={currentConfig.className || 'max-w-2xl'}>
        <DialogHeader>
          <DialogTitle>{currentConfig.title}</DialogTitle>
          {currentConfig.description && (
            <DialogDescription>{currentConfig.description}</DialogDescription>
          )}
        </DialogHeader>

        <ComponentToRender
          data={dialogState.data}
          onCancel={onClose}
          {...currentConfig.props} // ✅ 直接展开 props
        />
      </DialogContent>
    </Dialog>
  );
}
