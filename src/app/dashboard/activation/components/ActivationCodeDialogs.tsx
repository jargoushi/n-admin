/**
 * 激活码对话框管理组件
 *
 * @description
 * 统一管理激活码模块的所有对话框：
 * - 批量初始化对话框
 * - 派发激活码对话框
 * - 激活码详情对话框
 */

'use client';

import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ActivationCodeInitForm } from './ActivationCodeInitForm';
import { ActivationCodeDistributeForm } from './ActivationCodeDistributeForm';
import type {
  ActivationCodeDialogState,
  ActivationCodeInitFormData,
  ActivationCodeDistributeFormData,
  ActivationCodeBatchResponse
} from '../types';
import {
  TYPE_BADGE_MAP,
  STATUS_BADGE_MAP,
  DATE_TIME_FORMAT
} from '../constants';

/**
 * 对话框组件属性
 */
interface ActivationCodeDialogsProps {
  /** 对话框状态 */
  dialogState: ActivationCodeDialogState;
  /** 关闭对话框 */
  onClose: () => void;
  /** 批量初始化 */
  onInit: (
    data: ActivationCodeInitFormData
  ) => Promise<ActivationCodeBatchResponse | null>;
  /** 派发激活码 */
  onDistribute: (
    data: ActivationCodeDistributeFormData
  ) => Promise<string[] | null>;
}

/**
 * 激活码对话框管理组件
 *
 * @param props - 组件属性
 * @returns 对话框组件
 */
export function ActivationCodeDialogs({
  dialogState,
  onClose,
  onInit,
  onDistribute
}: ActivationCodeDialogsProps) {
  /**
   * 格式化日期时间
   */
  const formatDateTime = (dateString: string | undefined): string => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), DATE_TIME_FORMAT);
    } catch {
      return dateString;
    }
  };

  return (
    <>
      {/* 批量初始化对话框 */}
      <Dialog open={dialogState.type === 'init'} onOpenChange={onClose}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>批量初始化激活码</DialogTitle>
            <DialogDescription>
              批量生成不同类型的激活码，每种类型只能出现一次
            </DialogDescription>
          </DialogHeader>
          <ActivationCodeInitForm onSubmit={onInit} onCancel={onClose} />
        </DialogContent>
      </Dialog>

      {/* 派发激活码对话框 */}
      <Dialog open={dialogState.type === 'distribute'} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>派发激活码</DialogTitle>
            <DialogDescription>
              根据类型派发指定数量的未使用激活码，派发后状态将变为"已分发"
            </DialogDescription>
          </DialogHeader>
          <ActivationCodeDistributeForm
            onSubmit={onDistribute}
            onCancel={onClose}
          />
        </DialogContent>
      </Dialog>

      {/* 激活码详情对话框 */}
      <Dialog open={dialogState.type === 'detail'} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>激活码详情</DialogTitle>
          </DialogHeader>
          {dialogState.data && (
            <div className='space-y-4'>
              {/* 基本信息 */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>激活码</span>
                  <code className='font-mono text-sm'>
                    {dialogState.data.activation_code}
                  </code>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>类型</span>
                  <Badge
                    variant={
                      TYPE_BADGE_MAP[
                        dialogState.data.type as keyof typeof TYPE_BADGE_MAP
                      ]?.variant || 'secondary'
                    }
                  >
                    {dialogState.data.type_name}
                  </Badge>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>状态</span>
                  <Badge
                    variant={
                      STATUS_BADGE_MAP[
                        dialogState.data.status as keyof typeof STATUS_BADGE_MAP
                      ]?.variant || 'secondary'
                    }
                  >
                    {dialogState.data.status_name}
                  </Badge>
                </div>
              </div>

              {/* 时间信息 */}
              <div className='border-t pt-4'>
                <h4 className='mb-3 text-sm font-semibold'>时间信息</h4>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>
                      创建时间
                    </span>
                    <span className='text-sm'>
                      {formatDateTime(dialogState.data.created_at)}
                    </span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>
                      分发时间
                    </span>
                    <span className='text-sm'>
                      {formatDateTime(dialogState.data.distributed_at)}
                    </span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>
                      激活时间
                    </span>
                    <span className='text-sm'>
                      {formatDateTime(dialogState.data.activated_at)}
                    </span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>
                      过期时间
                    </span>
                    <span className='text-sm'>
                      {dialogState.data.type === 3
                        ? '永久有效'
                        : formatDateTime(dialogState.data.expire_time)}
                    </span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>
                      更新时间
                    </span>
                    <span className='text-sm'>
                      {formatDateTime(dialogState.data.updated_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
