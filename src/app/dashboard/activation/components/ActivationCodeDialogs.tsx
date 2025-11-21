/**
 * 激活码对话框管理组件 (已应用公共组件和类型修复)
 *
 * @description
 * 统一管理激活码模块的所有对话框，使用 EntityDetailView 和 ConfirmationDialog 简化代码。
 */

'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// 引入公共组件和类型
import {
  EntityDetailView,
  FieldConfig
} from '@/components/shared/EntityDetailView';
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog';

import { ActivationCodeInitForm } from './ActivationCodeInitForm';
import { ActivationCodeDistributeForm } from './ActivationCodeDistributeForm';
import type {
  // 导入 ActivationCode 和其他类型
  ActivationCode,
  ActivationCodeDialogState,
  ActivationCodeBatchCreateRequest,
  ActivationCodeGetRequest,
  ActivationCodeBatchResponse
} from '../types';
import { CODE_TYPE_CONFIG, STATUS_BADGE_MAP, MESSAGES } from '../constants';
import { formatDateTime } from '@/lib/data-utils';

/**
 * 对话框组件属性 (保持不变)
 */
interface ActivationCodeDialogsProps {
  /** 对话框状态 */
  dialogState: ActivationCodeDialogState;
  /** 关闭对话框 */
  onClose: () => void;
  /** 批量初始化 */
  onInit: (
    data: ActivationCodeBatchCreateRequest
  ) => Promise<ActivationCodeBatchResponse | null>;
  /** 派发激活码 */
  onDistribute: (data: ActivationCodeGetRequest) => Promise<string[] | null>;
  /** 确认对话框数据 */
  confirmDialog: {
    open: boolean;
    code: ActivationCode | null;
    type: 'activate' | 'invalidate' | null;
  };
  /** 确认操作 */
  onConfirm: () => void;
  /** 取消确认操作 */
  onCancelConfirm: () => void;
}

// 解决 TS 报错：定义一个本地类型别名，用于显式指定 key 的类型
type ActivationCodeKey = keyof ActivationCode;

// --- 激活码详情配置 (适配 EntityDetailView) ---
// 显式声明 CODE_DETAIL_CONFIG 的类型为 FieldConfig<ActivationCode>[]
const CODE_DETAIL_CONFIG: FieldConfig<ActivationCode>[] = [
  {
    label: '激活码',
    // 修复点: 显式断言 key 的类型
    key: 'activation_code' as ActivationCodeKey,
    render: (value: string) => (
      <code className='font-mono text-lg font-medium'>{value}</code>
    )
  },
  {
    label: '类型',
    // 修复点: 显式断言 key 的类型
    key: 'type' as ActivationCodeKey,
    render: (_: unknown, data: ActivationCode) => (
      <Badge
        variant={
          CODE_TYPE_CONFIG[data.type as keyof typeof CODE_TYPE_CONFIG]
            ?.variant || 'secondary'
        }
      >
        {data.type_name}
      </Badge>
    )
  },
  {
    label: '状态',
    // 修复点: 显式断言 key 的类型
    key: 'status' as ActivationCodeKey,
    render: (_: unknown, data: ActivationCode) => (
      <Badge
        variant={
          STATUS_BADGE_MAP[data.status as keyof typeof STATUS_BADGE_MAP]
            ?.variant || 'secondary'
        }
      >
        {data.status_name}
      </Badge>
    )
  },
  {
    label: '创建时间',
    key: 'created_at' as ActivationCodeKey,
    render: (value: string) => formatDateTime(value)
  },
  {
    label: '更新时间',
    key: 'updated_at' as ActivationCodeKey,
    render: (value: string) => formatDateTime(value)
  },
  {
    label: '过期时间',
    key: 'expire_time' as ActivationCodeKey,
    render: (_: unknown, data: ActivationCode) => {
      // 匹配原始逻辑：类型 3 为永久有效
      if (data.type === 3) return <span className='text-sm'>永久有效</span>;
      return (
        <span className='text-sm'>{formatDateTime(data.expire_time)}</span>
      );
    }
  },
  {
    label: '分发时间',
    key: 'distributed_at' as ActivationCodeKey,
    render: (value: string) => formatDateTime(value),
    hideIfEmpty: true // 如果为空则隐藏该字段
  },
  {
    label: '激活时间',
    key: 'activated_at' as ActivationCodeKey,
    render: (value: string) => formatDateTime(value),
    hideIfEmpty: true // 如果为空则隐藏该字段
  }
];

/**
 * 激活码对话框管理组件
 */
export function ActivationCodeDialogs({
  dialogState,
  onClose,
  onInit,
  onDistribute,
  confirmDialog,
  onConfirm,
  onCancelConfirm
}: ActivationCodeDialogsProps) {
  // 确认对话框的标题和描述
  const confirmTitle =
    confirmDialog.type === 'activate' ? '确认激活' : '确认作废';
  const confirmDescription = confirmDialog.code
    ? confirmDialog.type === 'activate'
      ? MESSAGES.CONFIRM.ACTIVATE(confirmDialog.code.activation_code)
      : MESSAGES.CONFIRM.INVALIDATE(confirmDialog.code.activation_code)
    : '';

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
          <ActivationCodeInitForm
            onSubmit={onInit}
            onCancel={onClose} // 修正: 使用 onClose 关闭主对话框
          />
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
            onCancel={onClose} // 修正: 使用 onClose 关闭主对话框
          />
        </DialogContent>
      </Dialog>

      {/* 激活码详情对话框 (使用 EntityDetailView) */}
      <Dialog open={dialogState.type === 'detail'} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>激活码详情</DialogTitle>
          </DialogHeader>

          {dialogState.data && (
            <>
              {/* 核心修复点: 将 config 传递给 EntityDetailView */}
              <EntityDetailView
                title='基本信息'
                data={dialogState.data as ActivationCode}
                config={CODE_DETAIL_CONFIG}
              />

              <div className='flex justify-end pt-4'>
                <Button variant='outline' onClick={onClose}>
                  关闭
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 确认对话框 (使用 ConfirmationDialog 替换 AlertDialog) */}
      <ConfirmationDialog
        isOpen={confirmDialog.open}
        title={confirmTitle}
        description={confirmDescription}
        onConfirm={onConfirm}
        onCancel={onCancelConfirm}
        confirmText={
          confirmDialog.type === 'activate' ? '确认激活' : '确认作废'
        }
      >
        {/* 激活码信息 (作为 Children 传入) */}
        {confirmDialog.code && (
          <div className='bg-muted space-y-2 rounded-md p-4'>
            <div className='text-sm'>
              <span className='text-muted-foreground'>激活码：</span>
              <code className='ml-2 font-mono'>
                {confirmDialog.code.activation_code}
              </code>
            </div>
            <div className='text-sm'>
              <span className='text-muted-foreground'>类型：</span>
              <span className='ml-2'>{confirmDialog.code.type_name}</span>
            </div>
            <div className='text-sm'>
              <span className='text-muted-foreground'>当前状态：</span>
              <span className='ml-2'>{confirmDialog.code.status_name}</span>
            </div>
          </div>
        )}
      </ConfirmationDialog>
    </>
  );
}
