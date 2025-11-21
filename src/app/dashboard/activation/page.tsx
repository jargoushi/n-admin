/**
 * 激活码管理页面
 *
 * @description
 * 激活码的完整管理界面，已重构为使用通用对话框管理模式。
 */

'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Pagination } from '@/components/table/pagination';

import {
  GenericDialogs,
  type DialogConfig
} from '@/components/shared/GenericDialogs';
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog';

// 引入业务组件
import {
  ActivationCodePageHeader,
  ActivationCodeFilters,
  ActivationCodeTable
} from './components';

// 引入具体表单和详情视图
import { ActivationCodeInitForm } from './components/ActivationCodeInitForm';
import { ActivationCodeDistributeForm } from './components/ActivationCodeDistributeForm';
import { ActivationCodeDetailView } from './components/ActivationCodeDetailView';

// 引入 Hooks 和类型
import { useActivationCodeFilters, useActivationCodeManagement } from './hooks';
import type { ActivationCode } from './types';
import { MESSAGES } from './constants';
import { useGenericDialogs } from '@/hooks/useGenericDialogs';

// ===================================================================
// 适配器组件 (关键修复点)
// 这里的目的是将 commonProps 中的 onInit/onDistribute 映射为表单需要的 onSubmit
// ===================================================================

const InitFormAdapter = (props: any) => {
  // 从 props 中取出 onInit，并将其作为 onSubmit 传递给表单
  const { onInit, ...rest } = props;
  return <ActivationCodeInitForm onSubmit={onInit} {...rest} />;
};

const DistributeFormAdapter = (props: any) => {
  // 从 props 中取出 onDistribute，并将其作为 onSubmit 传递给表单
  const { onDistribute, ...rest } = props;
  return <ActivationCodeDistributeForm onSubmit={onDistribute} {...rest} />;
};

// ===================================================================
// 对话框配置
// ===================================================================

const ACTIVATION_DIALOG_CONFIGS: Record<string, DialogConfig> = {
  init: {
    title: '批量初始化激活码',
    description: '批量生成不同类型的激活码，每种类型只能出现一次',
    component: InitFormAdapter, // 使用适配器组件
    className: 'max-w-2xl'
  },
  distribute: {
    title: '派发激活码',
    description: '根据类型派发指定数量的未使用激活码，派发后状态将变为"已分发"',
    component: DistributeFormAdapter // 使用适配器组件
  },
  detail: {
    title: '激活码详情',
    component: ActivationCodeDetailView, // 详情视图不需要适配，因为它只用 data 和 onCancel
    className: 'sm:max-w-[600px]'
  }
};

// ===================================================================
// 页面组件
// ===================================================================

export default function ActivationCodeManagementPage() {
  // ========== Hooks 初始化 ==========
  const { filters, searchFilters, updatePagination, resetFilters } =
    useActivationCodeFilters();

  const {
    codes,
    loading,
    pagination,
    fetchActivationCodes,
    initActivationCodes,
    distributeActivationCodes,
    activateCode,
    invalidateCode,
    getCodeDetail
  } = useActivationCodeManagement();

  // ========== 通用对话框状态管理 (Init / Distribute / Detail) ==========
  const { dialogState, openDialog, closeDialog } =
    useGenericDialogs<ActivationCode>();

  // ========== 确认对话框状态 (独立管理业务操作) ==========
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'activate' | 'invalidate' | null;
    code: ActivationCode | null;
  }>({
    open: false,
    type: null,
    code: null
  });

  // ========== 监听筛选条件变化 ==========
  useEffect(() => {
    fetchActivationCodes(filters);
  }, [filters, fetchActivationCodes]);

  // ========== 对话框操作处理器 ==========

  const handleOpenInitDialog = () => openDialog('init');

  const handleOpenDistributeDialog = () => openDialog('distribute');

  const handleOpenDetailDialog = async (code: ActivationCode) => {
    const detail = await getCodeDetail(code.activation_code);
    if (detail) {
      openDialog('detail', detail);
    }
  };

  /**
   * 通用关闭回调：关闭后刷新列表
   */
  const handleDialogCloseCallback = () => {
    fetchActivationCodes(filters);
  };

  // ========== 确认对话框操作处理器 ==========

  const handleActivateCode = (code: ActivationCode) => {
    setConfirmDialog({ open: true, type: 'activate', code });
  };

  const handleInvalidateCode = (code: ActivationCode) => {
    setConfirmDialog({ open: true, type: 'invalidate', code });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.code) return;

    const { type, code } = confirmDialog;
    if (type === 'activate') {
      await activateCode(code.activation_code);
    } else if (type === 'invalidate') {
      await invalidateCode(code.activation_code);
    }

    fetchActivationCodes(filters);
    setConfirmDialog({ open: false, type: null, code: null });
  };

  const handleCancelConfirm = () => {
    setConfirmDialog({ open: false, type: null, code: null });
  };

  const confirmTitle =
    confirmDialog.type === 'activate' ? '确认激活' : '确认作废';
  const confirmDescription = confirmDialog.code
    ? confirmDialog.type === 'activate'
      ? MESSAGES.CONFIRM.ACTIVATE(confirmDialog.code.activation_code)
      : MESSAGES.CONFIRM.INVALIDATE(confirmDialog.code.activation_code)
    : '';

  // ========== 页面渲染 ==========
  return (
    <PageContainer scrollable={false}>
      <div className='flex h-[calc(100vh-8rem)] w-full flex-col space-y-4'>
        {/* 页面头部 */}
        <ActivationCodePageHeader
          onInit={handleOpenInitDialog}
          onDistribute={handleOpenDistributeDialog}
        />

        {/* 搜索筛选 */}
        <ActivationCodeFilters
          filters={filters}
          onSearch={searchFilters}
          onReset={resetFilters}
          loading={loading}
        />

        {/* 表格和分页 */}
        <div className='flex min-h-0 flex-1 flex-col'>
          <div className='min-h-0'>
            <ActivationCodeTable
              data={codes}
              loading={loading}
              onActivate={handleActivateCode}
              onInvalidate={handleInvalidateCode}
              onViewDetail={handleOpenDetailDialog}
            />
          </div>

          <div className='shrink-0 pt-4'>
            <Pagination
              pagination={pagination}
              onPageChange={(page) => updatePagination({ page })}
              onPageSizeChange={(limit) => updatePagination({ limit, page: 1 })}
            />
          </div>
        </div>
      </div>

      {/* 1. 通用对话框管理 (Form & Detail) */}
      <GenericDialogs
        dialogState={dialogState}
        onClose={closeDialog}
        configs={ACTIVATION_DIALOG_CONFIGS}
        // 传递业务逻辑给 commonProps，由上方的 Adapter 组件进行映射
        commonProps={{
          onInit: initActivationCodes,
          onDistribute: distributeActivationCodes
        }}
        onCloseCallback={handleDialogCloseCallback}
      />

      {/* 2. 确认对话框 (Confirmation) */}
      <ConfirmationDialog
        isOpen={confirmDialog.open}
        title={confirmTitle}
        description={confirmDescription}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelConfirm}
        confirmText={
          confirmDialog.type === 'activate' ? '确认激活' : '确认作废'
        }
      >
        {confirmDialog.code && (
          <div className='bg-muted mt-2 space-y-2 rounded-md p-4'>
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
    </PageContainer>
  );
}
