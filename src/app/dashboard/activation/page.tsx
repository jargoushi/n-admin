/**
 * 激活码管理页面
 *
 * @description
 * 激活码的完整管理界面。
 * 采用通用组件架构：
 * 1. GenericDialogs: 管理初始化、派发、详情弹窗
 * 2. ConfirmationDialog: 管理激活、作废等确认操作
 */

'use client';

import { useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Pagination } from '@/components/table/pagination';

// 1. 引入通用弹窗基础设施
import {
  GenericDialogs,
  type DialogConfig
} from '@/components/shared/GenericDialogs';
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog';
import { useGenericDialogs } from '@/hooks/useGenericDialogs';
import { useConfirmation } from '@/hooks/useConfirmation';

// 2. 引入业务组件
import {
  ActivationCodePageHeader,
  ActivationCodeFilters,
  ActivationCodeTable
} from './components';

// 3. 引入具体表单和详情视图 (用于 GenericDialogs 配置)
import { ActivationCodeInitForm } from './components/ActivationCodeInitForm';
import { ActivationCodeDistributeForm } from './components/ActivationCodeDistributeForm';
import { ActivationCodeDetailView } from './components/ActivationCodeDetailView';

// 4. 引入 Hooks 和类型
import { useActivationCodeFilters, useActivationCodeManagement } from './hooks';
import type { ActivationCode } from './types';
import { MESSAGES } from './constants';

// ===================================================================
// 业务弹窗配置表
// ===================================================================

const ACTIVATION_DIALOG_CONFIGS: Record<string, DialogConfig> = {
  init: {
    title: '批量初始化激活码',
    description: '批量生成不同类型的激活码，每种类型只能出现一次',
    component: ActivationCodeInitForm,
    className: 'max-w-2xl'
  },
  distribute: {
    title: '派发激活码',
    description: '根据类型派发指定数量的未使用激活码，派发后状态将变为"已分发"',
    component: ActivationCodeDistributeForm
  },
  detail: {
    title: '激活码详情',
    component: ActivationCodeDetailView,
    className: 'sm:max-w-[600px]'
  }
};

// ===================================================================
// 页面主组件
// ===================================================================

export default function ActivationCodeManagementPage() {
  // 1. 初始化业务 Hooks
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

  // 2. 初始化通用弹窗 Hooks
  const { dialogState, openDialog, closeDialog } =
    useGenericDialogs<ActivationCode>();

  // 3. 初始化确认框 Hook (新)
  const { confirm, dialogProps } = useConfirmation();

  // 4. 数据加载副作用
  useEffect(() => {
    fetchActivationCodes(filters);
  }, [filters, fetchActivationCodes]);

  // =================================================================
  // 事件处理逻辑
  // =================================================================

  /**
   * 通用关闭回调：弹窗关闭后刷新列表
   */
  const handleDialogCloseCallback = () => {
    fetchActivationCodes(filters);
  };

  /**
   * 处理查看详情
   */
  const handleViewDetail = async (code: ActivationCode) => {
    const detail = await getCodeDetail(code.activation_code);
    if (detail) {
      openDialog('detail', detail);
    }
  };

  /**
   * 处理激活操作 (使用 useConfirmation)
   */
  const handleActivate = (code: ActivationCode) => {
    confirm({
      title: '确认激活',
      // 这里的 description 支持 JSX，可以展示富文本详情
      description: (
        <div className='space-y-2'>
          <p>{MESSAGES.CONFIRM.ACTIVATE(code.activation_code)}</p>
          <div className='bg-muted/50 rounded p-2 text-xs'>
            <div className='flex gap-2'>
              <span className='text-muted-foreground'>类型:</span>
              <span>{code.type_name}</span>
            </div>
          </div>
        </div>
      ),
      confirmText: '立即激活',
      variant: 'default',
      onConfirm: async () => {
        await activateCode(code.activation_code);
        fetchActivationCodes(filters); // 操作成功后刷新
      }
    });
  };

  /**
   * 处理作废操作 (使用 useConfirmation)
   */
  const handleInvalidate = (code: ActivationCode) => {
    confirm({
      title: '确认作废',
      description: MESSAGES.CONFIRM.INVALIDATE(code.activation_code),
      confirmText: '确认作废',
      variant: 'destructive', // 危险操作标红
      onConfirm: async () => {
        await invalidateCode(code.activation_code);
        fetchActivationCodes(filters); // 操作成功后刷新
      }
    });
  };

  // =================================================================
  // 渲染 UI
  // =================================================================
  return (
    <PageContainer scrollable={false}>
      <div className='flex h-[calc(100vh-8rem)] w-full flex-col space-y-4'>
        {/* 页面头部 */}
        <ActivationCodePageHeader
          onInit={() => openDialog('init')}
          onDistribute={() => openDialog('distribute')}
        />

        {/* 筛选区域 */}
        <ActivationCodeFilters
          filters={filters}
          onSearch={searchFilters}
          onReset={resetFilters}
          loading={loading}
        />

        {/* 表格区域 */}
        <div className='flex min-h-0 flex-1 flex-col'>
          <div className='min-h-0'>
            <ActivationCodeTable
              data={codes}
              loading={loading}
              onActivate={handleActivate}
              onInvalidate={handleInvalidate}
              onViewDetail={handleViewDetail}
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

      {/* 1. 通用业务弹窗 (Init / Distribute / Detail) */}
      <GenericDialogs
        dialogState={dialogState}
        onClose={closeDialog}
        configs={ACTIVATION_DIALOG_CONFIGS}
        // 使用 propsMap 精准投喂
        propsMap={{
          init: {
            onSubmit: initActivationCodes
          },
          distribute: {
            onSubmit: distributeActivationCodes
          }
          // 'detail' 不需要额外 props，这里不用写，或者写个空对象 {}
        }}
        onCloseCallback={handleDialogCloseCallback}
      />

      {/* 2. 通用确认弹窗 (Activate / Invalidate) */}
      <ConfirmationDialog {...dialogProps} />
    </PageContainer>
  );
}
