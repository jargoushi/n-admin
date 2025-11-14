/**
 * 激活码管理页面
 *
 * @description
 * 激活码的完整管理界面，包括：
 * - 批量初始化激活码
 * - 派发激活码
 * - 激活码激活
 * - 激活码作废
 * - 分页列表查询
 * - 高级筛选
 */

'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Pagination } from '@/components/table/pagination';
import {
  ActivationCodePageHeader,
  ActivationCodeFilters,
  ActivationCodeTable,
  ActivationCodeDialogs
} from './components';
import { useActivationCodeFilters, useActivationCodeManagement } from './hooks';
import type { ActivationCode, ActivationCodeDialogState } from './types';
import { MESSAGES } from './constants';

/**
 * 激活码管理页面组件
 *
 * @description
 * 参考用户模块设计，完整实现激活码的CRUD操作
 * - 分层 Hook 设计（筛选状态 + 业务逻辑）
 * - URL 持久化筛选条件
 * - 手动查询模式
 * - 对话框统一管理
 *
 * @returns 激活码管理页面
 */
export default function ActivationCodeManagementPage() {
  // ========== Hooks 初始化 ==========
  const { filters, searchFilters, updatePagination, clearFilters } =
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

  // ========== 对话框状态 ==========
  const [dialogState, setDialogState] = useState<ActivationCodeDialogState>({
    type: null,
    data: null,
    open: false
  });

  // ========== 监听筛选条件变化 ==========
  useEffect(() => {
    fetchActivationCodes(filters);
  }, [filters, fetchActivationCodes]);

  // ========== 对话框操作 ==========

  /**
   * 打开批量初始化对话框
   */
  const handleOpenInitDialog = () => {
    setDialogState({ type: 'init', data: null, open: true });
  };

  /**
   * 打开派发激活码对话框
   */
  const handleOpenDistributeDialog = () => {
    setDialogState({ type: 'distribute', data: null, open: true });
  };

  /**
   * 打开激活码详情对话框
   */
  const handleOpenDetailDialog = async (code: ActivationCode) => {
    const detail = await getCodeDetail(code.activation_code);
    if (detail) {
      setDialogState({ type: 'detail', data: detail, open: true });
    }
  };

  /**
   * 关闭对话框
   */
  const handleCloseDialog = () => {
    setDialogState({ type: null, data: null, open: false });
    // 刷新列表
    fetchActivationCodes(filters);
  };

  // ========== 表格操作 ==========

  /**
   * 激活激活码
   */
  const handleActivateCode = async (code: ActivationCode) => {
    // 确认对话框
    const confirmed = window.confirm(
      MESSAGES.CONFIRM.ACTIVATE(code.activation_code)
    );
    if (!confirmed) return;

    const success = await activateCode(code.activation_code);
    if (success) {
      // 刷新列表
      fetchActivationCodes(filters);
    }
  };

  /**
   * 作废激活码
   */
  const handleInvalidateCode = async (code: ActivationCode) => {
    // 确认对话框
    const confirmed = window.confirm(
      MESSAGES.CONFIRM.INVALIDATE(code.activation_code)
    );
    if (!confirmed) return;

    const success = await invalidateCode(code.activation_code);
    if (success) {
      // 刷新列表
      fetchActivationCodes(filters);
    }
  };

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
          onReset={clearFilters}
          loading={loading}
        />

        {/* 表格和分页 */}
        <div className='flex min-h-0 flex-1 flex-col'>
          {/* 表格容器 */}
          <div className='min-h-0'>
            <ActivationCodeTable
              data={codes}
              loading={loading}
              pagination={pagination}
              onActivate={handleActivateCode}
              onInvalidate={handleInvalidateCode}
              onViewDetail={handleOpenDetailDialog}
            />
          </div>

          {/* 分页组件 */}
          <div className='flex-shrink-0 pt-4'>
            <Pagination
              pagination={pagination}
              onPageChange={(page) => updatePagination({ page })}
              onPageSizeChange={(limit) => updatePagination({ limit, page: 1 })}
              pageSizeOptions={[10, 20, 30, 50, 100]}
            />
          </div>
        </div>
      </div>

      {/* 对话框管理 */}
      <ActivationCodeDialogs
        dialogState={dialogState}
        onClose={handleCloseDialog}
        onInit={initActivationCodes}
        onDistribute={distributeActivationCodes}
      />
    </PageContainer>
  );
}
