/**
 * 激活码管理页面
 *
 * @description
 * 激活码的完整管理界面
 * 负责数据管理和布局,弹窗逻辑由子组件自治管理
 */

'use client';

import PageContainer from '@/components/layout/page-container';
import { Pagination } from '@/components/table/pagination';

import { useActivationCodeList } from './hooks/useActivationCodeList';
import { ActivationCodeFilters } from './components/ActivationCodeFilters';
import { ActivationCodePageHeader } from './components/ActivationCodePageHeader';
import { ActivationCodeTable } from './components/ActivationCodeTable';

export default function ActivationCodeManagementPage() {
  // 使用统一的 Hook 管理筛选和列表数据
  const {
    filters,
    search,
    setFilters,
    resetFilters,
    codes,
    loading,
    pagination,
    refresh
  } = useActivationCodeList();

  return (
    <PageContainer scrollable={false}>
      <div className='flex h-[calc(100vh-8rem)] w-full flex-col space-y-4'>
        {/* 页面头部 */}
        <ActivationCodePageHeader onSuccess={refresh} />

        {/* 筛选区域 */}
        <ActivationCodeFilters
          filters={filters}
          onSearch={search}
          onReset={resetFilters}
        />

        {/* 表格区域 */}
        <div className='flex min-h-0 flex-1 flex-col'>
          <div className='min-h-0'>
            <ActivationCodeTable
              data={codes}
              loading={loading}
              onRefresh={refresh}
            />
          </div>

          <div className='shrink-0 pt-4'>
            <Pagination
              pagination={pagination}
              onPageChange={(page) => setFilters({ page })}
              onPageSizeChange={(size) => setFilters({ size, page: 1 })}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
