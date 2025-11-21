/**
 * 基础表单布局组件 (已优化，模式控制更清晰)
 *
 * @description
 * 统一提供表单的容器、状态管理和操作区域。
 * 模式判断：当 resultContent 存在时，自动进入“结果模式”。
 */
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface BaseFormLayoutProps {
  /** 提交函数 */
  onSubmit: () => Promise<void>;
  /** 取消/关闭回调 */
  onCancel: () => void;
  /** 表单输入内容 (表单模式下显示) */
  children: React.ReactNode;
  /** 表单是否有效 (用于禁用提交按钮) */
  isValid: boolean;
  /** 提交按钮文本 */
  submitText: string;
  /** 加载状态 */
  isLoading: boolean;

  /** 结果展示内容 (结果模式下显示。如果存在，则自动隐藏默认操作按钮) */
  resultContent?: React.ReactNode;
}

/**
 * 基础表单布局组件
 */
export function BaseFormLayout({
  onSubmit,
  onCancel,
  children,
  isValid,
  submitText,
  isLoading,
  resultContent // 仅通过 result content 的存在来判断模式
}: BaseFormLayoutProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isLoading) {
      await onSubmit();
    }
  };

  // 🚀 核心：通过 resultContent 的存在判断是否处于结果模式
  const isResultMode = !!resultContent;

  // 内容区域：结果模式显示 resultContent，否则显示 children
  const content = isResultMode ? resultContent : children;

  return (
    <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
      {/* 1. 表单/结果内容区域：使用 min-height 保持对话框大小稳定 */}
      {/* 保持 min-height 确保对话框在切换模式时不会抖动 */}
      <div className='min-h-[200px]'>{content}</div>

      {/* 3. 操作按钮区域 (仅在表单输入模式下显示) */}
      {!isResultMode && (
        <div className='flex justify-end gap-2'>
          {/* 取消按钮 */}
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isLoading}
          >
            取消
          </Button>

          {/* 提交按钮 */}
          <Button type='submit' disabled={!isValid || isLoading}>
            {isLoading ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : null}
            {submitText}
          </Button>
        </div>
      )}
    </form>
  );
}
