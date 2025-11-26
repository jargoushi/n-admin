/**
 * 任务管理页面
 *
 * @description
 * 任务的完整管理界面
 * 负责数据管理和布局
 */

'use client';

import PageContainer from '@/components/layout/page-container';
import { Pagination } from '@/components/table/pagination';

import { useMonitorTaskList } from './hooks/useMonitorTaskList';
import { MonitorTaskFilters } from './components/MonitorTaskFilters';
import { MonitorTaskTable } from './components/MonitorTaskTable';

export default function MonitorTaskManagementPage() {
  // 使用统一的 Hook 管理筛选和列表数据
  const {
    filters,
    search,
    setFilters,
    resetFilters,
    tasks,
    loading,
    pagination
  } = useMonitorTaskList();

  return (
    <PageContainer scrollable={false}>
      <div className='flex h-[calc(100vh-8rem)] w-full flex-col space-y-4'>
        {/* 筛选区域 */}
        <MonitorTaskFilters
          filters={filters}
          onSearch={search}
          onReset={resetFilters}
        />

        {/* 表格区域 */}
        <div className='flex min-h-0 flex-1 flex-col'>
          <div className='min-h-0'>
            <MonitorTaskTable data={tasks} loading={loading} />
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
