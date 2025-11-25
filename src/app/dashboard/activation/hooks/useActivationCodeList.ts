/**
 * 激活码列表管理 Hook
 *
 * @description
 * 统一管理激活码列表的筛选和数据状态
 * - 筛选条件管理（含 URL 同步）
 * - 列表数据管理（codes, loading, pagination）
 * - 自动加载：筛选条件变化时自动获取数据
 */

import { useState, useCallback, useEffect } from 'react';
import { ActivationApiService } from '@/service/api/activation.api';
import { useUrlFilters } from '@/components/shared/use-url-filters';
import type { ActivationCode, ActivationCodeQueryRequest } from '../types';
import type { PaginationInfo } from '@/lib/http/types';
import { DEFAULT_QUERY_PARAMS } from '../constants';
import { DEFAULT_PAGINATION } from '@/constants/pagination';

/**
 * Hook 返回值
 */
interface UseActivationCodeListReturn {
  // 筛选相关
  filters: ActivationCodeQueryRequest;
  setFilters: (filters: Partial<ActivationCodeQueryRequest>) => void;
  search: (filters: Partial<ActivationCodeQueryRequest>) => void;
  resetFilters: () => void;

  // 列表数据相关
  codes: ActivationCode[];
  loading: boolean;
  pagination: PaginationInfo;
  refresh: () => void;
}

/**
 * 激活码列表管理 Hook
 *
 * @description
 * 统一管理筛选条件和列表数据，自动处理数据加载
 *
 * @returns {UseActivationCodeListReturn} 筛选状态、列表数据和操作方法
 */
export function useActivationCodeList(): UseActivationCodeListReturn {
  // 筛选条件管理（含 URL 同步）
  const { filters, setFilters, resetFilters } =
    useUrlFilters<ActivationCodeQueryRequest>(DEFAULT_QUERY_PARAMS);

  // 列表数据状态
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] =
    useState<PaginationInfo>(DEFAULT_PAGINATION);

  // 获取列表数据
  const fetchList = useCallback(async (params: ActivationCodeQueryRequest) => {
    setLoading(true);

    try {
      const response = await ActivationApiService.getPageList(params);
      const { items, ...paginationInfo } = response;
      setCodes(items);
      setPagination(paginationInfo);
    } finally {
      setLoading(false);
    }
  }, []);

  // 搜索时自动重置页码
  const search = useCallback(
    (newFilters: Partial<ActivationCodeQueryRequest>) => {
      setFilters({ ...newFilters, page: 1 });
    },
    [setFilters]
  );

  // 刷新当前数据
  const refresh = useCallback(() => {
    fetchList(filters);
  }, [filters, fetchList]);

  // 监听筛选条件变化，自动加载数据
  useEffect(() => {
    fetchList(filters);
  }, [filters, fetchList]);

  return {
    // 筛选相关
    filters,
    setFilters,
    search,
    resetFilters,

    // 列表数据相关
    codes,
    loading,
    pagination,
    refresh
  };
}
