/**
 * 激活码管理页面
 *
 * @description
 * 激活码的完整管理界面
 * 负责数据管理和布局,弹窗逻辑由子组件自治管理
 */

'use client';

import { useEffect, useCallback } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Pagination } from '@/components/table/pagination';

import { useActivationCodeFilters } from './hooks/useActivationCodeFilters';
import { useActivationCodeManagement } from './hooks/useActivationCodeManagement';
import { ActivationCodeFilters } from './components/ActivationCodeFilters';
import { ActivationCodePageHeader } from './components/ActivationCodePageHeader';
import { ActivationCodeTable } from './components/ActivationCodeTable';

export default function ActivationCodeManagementPage() {
  // 初始化业务 Hooks
  const { filters, searchFilters, updatePagination } =
    useActivationCodeFilters();

  const { codes, loading, pagination, fetchActivationCodes } =
    useActivationCodeManagement();

  // 刷新列表数据
  const handleRefresh = useCallback(() => {
    fetchActivationCodes(filters);
  }, [filters, fetchActivationCodes]);

  // 数据加载副作用
  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  return (
    <PageContainer scrollable={false}>
      <div className='flex h-[calc(100vh-8rem)] w-full flex-col space-y-4'>
        {/* 页面头部 */}
        <ActivationCodePageHeader onSuccess={handleRefresh} />

        {/* 筛选区域 */}
        <ActivationCodeFilters filters={filters} onSearch={searchFilters} />

        {/* 表格区域 */}
        <div className='flex min-h-0 flex-1 flex-col'>
          <div className='min-h-0'>
            <ActivationCodeTable
              data={codes}
              loading={loading}
              onRefresh={handleRefresh}
            />
          </div>

          <div className='shrink-0 pt-4'>
            <Pagination
              pagination={pagination}
              onPageChange={(page) => updatePagination({ page })}
              onPageSizeChange={(size) => updatePagination({ size, page: 1 })}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
