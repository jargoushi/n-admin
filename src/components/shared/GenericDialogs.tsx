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

// 1. 定义组件配置类型
export interface DialogConfig {
  title: string;
  description?: string;
  // component 是需要渲染的 React 组件类型
  component: ComponentType<any>;
  // 可以添加 max-width, full-screen 等样式配置
  className?: string;
}

interface GenericDialogsProps {
  /** Hook 返回的对话框状态 */
  dialogState: GenericDialogState;
  /** 关闭对话框的回调函数 (通常是 useGenericDialogs 提供的 closeDialog) */
  onClose: (callback?: () => void) => void;
  /** 业务模块定义的配置映射表 */
  configs: Record<string, DialogConfig>;
  /** 传递给所有子组件的通用 Props (如 onSubmit, onCancel, 业务 Hook 的方法等) */
  commonProps?: Record<string, any>;
  /** 关闭后执行的回调（例如：刷新列表） */
  onCloseCallback?: () => void;
}

/**
 * 统一对话框渲染组件
 * 根据 dialogState.type 动态渲染配置的组件
 */
export function GenericDialogs({
  dialogState,
  onClose,
  configs,
  commonProps = {},
  onCloseCallback
}: GenericDialogsProps) {
  // 仅在 type 存在时查找配置
  const currentConfig = useMemo(() => {
    if (!dialogState.type) return null;
    return configs[dialogState.type];
  }, [dialogState.type, configs]);

  if (!currentConfig) {
    return null;
  }

  // 动态获取要渲染的组件
  const ComponentToRender = currentConfig.component;

  // 统一的关闭处理，执行传入的业务回调
  const handleClose = () => {
    onClose(onCloseCallback);
  };

  return (
    <Dialog open={dialogState.open} onOpenChange={handleClose}>
      {/* 使用配置的 className 或默认值 */}
      <DialogContent className={currentConfig.className || 'max-w-2xl'}>
        <DialogHeader>
          <DialogTitle>{currentConfig.title}</DialogTitle>
          {currentConfig.description && (
            <DialogDescription>{currentConfig.description}</DialogDescription>
          )}
        </DialogHeader>

        {/* 渲染动态组件，并传递必要的 props */}
        <ComponentToRender
          // 1. 传入对话框打开时携带的数据 (例如详情对象)
          data={dialogState.data}
          // 2. 传入通用的取消回调，即关闭对话框
          onCancel={handleClose}
          // 3. 传入业务模块提供的其他 Props (onSubmit, onInit, onDistribute 等)
          {...commonProps}
        />
      </DialogContent>
    </Dialog>
  );
}
