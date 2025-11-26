/**
 * 任务列表 Hook
 *
 * @description
 * 统一管理任务列表的筛选、查询和分页逻辑
 */

import { useState, useCallback, useEffect } from 'react';
import { TaskApiService } from '@/service/api/task.api';
import { useUrlFilters } from '@/components/shared/use-url-filters';
import type { MonitorTask, MonitorTaskQueryRequest } from '../types';
import type { PaginationInfo } from '@/lib/http/types';
import { DEFAULT_QUERY_PARAMS } from '../constants';
import { DEFAULT_PAGINATION } from '@/constants/pagination';

export function useMonitorTaskList() {
  // 筛选条件管理（含 URL 同步）
  const { filters, setFilters, resetFilters } =
    useUrlFilters<MonitorTaskQueryRequest>(DEFAULT_QUERY_PARAMS);

  // 列表数据
  const [tasks, setTasks] = useState<MonitorTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] =
    useState<PaginationInfo>(DEFAULT_PAGINATION);

  /**
   * 查询列表数据
   */
  const fetchList = useCallback(async (params: MonitorTaskQueryRequest) => {
    setLoading(true);
    try {
      const response = await TaskApiService.getPageList(params);
      const { items, ...paginationInfo } = response;
      setTasks(items);
      setPagination(paginationInfo);
    } catch (error) {
      console.error('查询任务列表失败:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 执行搜索（自动重置页码）
   */
  const search = useCallback(
    (newFilters: Partial<MonitorTaskQueryRequest>) => {
      setFilters({ ...newFilters, page: 1 });
    },
    [setFilters]
  );

  /**
   * 刷新列表（保持当前筛选条件）
   */
  const refresh = useCallback(() => {
    fetchList(filters);
  }, [filters, fetchList]);

  // 监听筛选条件变化，自动加载数据
  useEffect(() => {
    fetchList(filters);
  }, [filters, fetchList]);

  return {
    filters,
    setFilters,
    search,
    resetFilters,
    tasks,
    loading,
    pagination,
    refresh
  };
}
