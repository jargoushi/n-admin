/**
 * 监控配置管理页面
 *
 * @description
 * 监控配置的完整管理界面
 * 负责数据管理和布局,弹窗逻辑由子组件自治管理
 */

'use client';

import PageContainer from '@/components/layout/page-container';
import { Pagination } from '@/components/table/pagination';

import { useMonitorConfigList } from './hooks/useMonitorConfigList';
import { MonitorConfigFilters } from './components/MonitorConfigFilters';
import { MonitorConfigPageHeader } from './components/MonitorConfigPageHeader';
import { MonitorConfigTable } from './components/MonitorConfigTable';

export default function MonitorConfigManagementPage() {
  // 使用统一的 Hook 管理筛选和列表数据
  const {
    filters,
    search,
    setFilters,
    resetFilters,
    configs,
    loading,
    pagination,
    refresh
  } = useMonitorConfigList();

  return (
    <PageContainer scrollable={false}>
      <div className='flex h-[calc(100vh-8rem)] w-full flex-col space-y-6'>
        {/* 页面头部 */}
        <div className='animate-in fade-in slide-in-from-top-4 duration-500'>
          <MonitorConfigPageHeader onSuccess={refresh} />
        </div>

        {/* 筛选区域 */}
        <div className='animate-in fade-in slide-in-from-top-4 delay-100 duration-500'>
          <MonitorConfigFilters
            filters={filters}
            onSearch={search}
            onReset={resetFilters}
          />
        </div>

        {/* 表格区域 */}
        <div className='animate-in fade-in slide-in-from-bottom-4 flex min-h-0 flex-1 flex-col delay-200 duration-500'>
          <div className='border-border/50 bg-card/50 min-h-0 rounded-xl border shadow-sm backdrop-blur-sm transition-all hover:shadow-md'>
            <MonitorConfigTable
              data={configs}
              loading={loading}
              onRefresh={refresh}
            />
          </div>

          <div className='shrink-0 pt-6'>
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
