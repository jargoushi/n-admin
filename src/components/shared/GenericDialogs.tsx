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
  type: string | null;
  data: T | null;
  open: boolean;
}

// 弹窗配置接口
export interface DialogConfig {
  title: string;
  description?: string;
  component: ComponentType<any>;
  className?: string;
  props?: Record<string, any>;
}

interface GenericDialogsProps {
  dialogState: GenericDialogState;
  onClose: () => void;
  dialogs: Record<string, DialogConfig>;
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
          {...currentConfig.props}
        />
      </DialogContent>
    </Dialog>
  );
}
