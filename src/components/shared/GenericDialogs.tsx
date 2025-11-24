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
import { GenericDialogState } from '@/hooks/useGenericDialogs';

// ... DialogConfig 接口保持不变 ...
export interface DialogConfig {
  title: string;
  description?: string;
  component: ComponentType<any>;
  className?: string;
}

interface GenericDialogsProps {
  dialogState: GenericDialogState;
  onClose: (callback?: () => void) => void;
  configs: Record<string, DialogConfig>;

  /** * 通用 Props (所有弹窗都会收到的)
   * 比如: onCancel, userSession 等全局通用的
   */
  commonProps?: Record<string, any>;

  /**
   * 🔥 新增：按类型注入的 Props (特定弹窗独享的)
   * key 对应 dialogState.type
   * value 是要传递给该组件的 props 对象
   */
  propsMap?: Record<string, Record<string, any>>;

  onCloseCallback?: () => void;
}

export function GenericDialogs({
  dialogState,
  onClose,
  configs,
  commonProps = {},
  propsMap = {}, // 🔥 默认为空对象
  onCloseCallback
}: GenericDialogsProps) {
  const currentConfig = useMemo(() => {
    if (!dialogState.type) return null;
    return configs[dialogState.type];
  }, [dialogState.type, configs]);

  if (!currentConfig) {
    return null;
  }

  const ComponentToRender = currentConfig.component;

  const handleClose = () => {
    onClose(onCloseCallback);
  };

  // 🔥 核心逻辑：获取当前类型对应的专属 Props
  const specificProps = dialogState.type ? propsMap[dialogState.type] : {};

  return (
    <Dialog open={dialogState.open} onOpenChange={handleClose}>
      <DialogContent className={currentConfig.className || 'max-w-2xl'}>
        <DialogHeader>
          <DialogTitle>{currentConfig.title}</DialogTitle>
          {currentConfig.description && (
            <DialogDescription>{currentConfig.description}</DialogDescription>
          )}
        </DialogHeader>

        <ComponentToRender
          // 1. 传入数据
          data={dialogState.data}
          // 2. 传入通用 Props
          onCancel={handleClose}
          {...commonProps}
          // 3. 🔥 传入专属 Props (优先级最高，放在最后可以覆盖通用 props)
          {...specificProps}
        />
      </DialogContent>
    </Dialog>
  );
}
