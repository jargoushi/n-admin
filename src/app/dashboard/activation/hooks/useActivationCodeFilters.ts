import type { ActivationCodeQueryRequest } from '../types';
import { DEFAULT_QUERY_PARAMS } from '../constants';
import { useUrlFilters } from '@/components/shared/use-url-filters';

export function useActivationCodeFilters() {
  // ✅ 核心逻辑直接托管给通用 Hook
  const { filters, setFilters, resetFilters } =
    useUrlFilters<ActivationCodeQueryRequest>(DEFAULT_QUERY_PARAMS);

  // 封装业务特有的操作方法
  const searchFilters = (newFilters: Partial<ActivationCodeQueryRequest>) => {
    setFilters({
      ...newFilters,
      page: 1
    });
  };

  const updatePagination = (pagination: { page?: number; size?: number }) => {
    setFilters({
      ...(pagination.page && { page: pagination.page }),
      ...(pagination.size && { size: pagination.size })
    });
  };

  return {
    filters,
    searchFilters,
    updatePagination,
    resetFilters
  };
}
