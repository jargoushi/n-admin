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
import { useGenericDialogs } from '@/hooks/useGenericDialogs';
import { useConfirmation } from '@/hooks/useConfirmation';

import { ActivationCodeInitForm } from './components/ActivationCodeInitForm';
import { ActivationCodeDistributeForm } from './components/ActivationCodeDistributeForm';
import { ActivationCodeDetailView } from './components/ActivationCodeDetailView';

import type { ActivationCode } from './types';
import { MESSAGES } from './constants';
import { useActivationCodeFilters } from './hooks/useActivationCodeFilters';
import { useActivationCodeManagement } from './hooks/useActivationCodeManagement';
import { ActivationCodeFilters } from './components/ActivationCodeFilters';
import { ActivationCodePageHeader } from './components/ActivationCodePageHeader';
import { ActivationCodeTable } from './components/ActivationCodeTable';

export default function ActivationCodeManagementPage() {
  // 1. 初始化业务 Hooks
  const { filters, searchFilters, updatePagination, resetFilters } =
    useActivationCodeFilters();

  const {
    codes,
    loading,
    pagination,
    fetchActivationCodes,
    activateCode,
    invalidateCode,
    getCodeDetail
  } = useActivationCodeManagement();

  // 2. 初始化通用弹窗 Hooks
  const { openDialog, DialogsContainer } = useGenericDialogs<ActivationCode>({
    dialogs: {
      init: {
        title: '批量初始化激活码',
        description: '批量生成不同类型的激活码，每种类型只能出现一次',
        component: ActivationCodeInitForm,
        className: 'max-w-2xl'
      },
      distribute: {
        title: '派发激活码',
        description:
          '根据类型派发指定数量的未使用激活码，派发后状态将变为"已分发"',
        component: ActivationCodeDistributeForm
      },
      detail: {
        title: '激活码详情',
        component: ActivationCodeDetailView,
        className: 'sm:max-w-[600px]'
      }
    },
    onClose: () => fetchActivationCodes(filters)
  });

  // 3. 初始化确认框 Hook
  const { confirm, ConfirmDialog } = useConfirmation();

  // 4. 数据加载副作用
  useEffect(() => {
    fetchActivationCodes(filters);
  }, [filters, fetchActivationCodes]);

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
   * 处理激活操作
   */
  const handleActivate = (code: ActivationCode) => {
    confirm({
      description: MESSAGES.CONFIRM.ACTIVATE(code.activation_code),
      onConfirm: async () => {
        await activateCode(code.activation_code);
        fetchActivationCodes(filters);
      }
    });
  };

  /**
   * 处理作废操作
   */
  const handleInvalidate = (code: ActivationCode) => {
    confirm({
      description: MESSAGES.CONFIRM.INVALIDATE(code.activation_code),
      onConfirm: async () => {
        await invalidateCode(code.activation_code);
        fetchActivationCodes(filters);
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
      <DialogsContainer />

      {/* 2. 通用确认弹窗 (Activate / Invalidate) */}
      <ConfirmDialog />
    </PageContainer>
  );
}
