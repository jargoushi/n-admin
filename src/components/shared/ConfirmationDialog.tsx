/**
 * 通用确认对话框组件
 *
 * @description
 * 封装 AlertDialog 结构，用于各种危险/确认操作前的二次确认。
 */

'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

/**
 * 确认对话框组件属性
 */
interface ConfirmationDialogProps {
  /** 是否打开对话框 */
  isOpen: boolean;
  /** 对话框标题 */
  title: string;
  /** 描述内容 (可以是 React 节点) */
  description: React.ReactNode;
  /** 确认按钮文本 */
  confirmText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 确认操作回调 */
  onConfirm: () => void;
  /** 取消/关闭操作回调 */
  onCancel: () => void;
  /** 自定义内容（位于描述和页脚之间，例如：要操作的实体信息） */
  children?: React.ReactNode;
  /** 确认按钮是否禁用 */
  confirmDisabled?: boolean;
}

/**
 * 通用确认对话框组件
 *
 * @param props - 组件属性
 * @returns 确认对话框
 */
export function ConfirmationDialog({
  isOpen,
  title,
  description,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  children,
  confirmDisabled = false
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {/* 自定义内容区 */}
        {children}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={confirmDisabled}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
