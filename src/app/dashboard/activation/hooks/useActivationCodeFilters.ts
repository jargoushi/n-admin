/**
 * 激活码筛选状态管理 Hook
 *
 * @description
 * 管理激活码列表的筛选条件，支持 URL 同步和手动查询模式
 * 参考用户模块的 useUserFilters 实现
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ActivationCodeFilters } from '../types';
import { DEFAULT_FILTERS } from '../constants';

/**
 * 激活码筛选 Hook 返回值
 */
interface UseActivationCodeFiltersReturn {
  /** 当前筛选条件 */
  filters: ActivationCodeFilters;
  /** 手动执行查询（更新筛选条件并同步URL） */
  searchFilters: (newFilters: Partial<ActivationCodeFilters>) => void;
  /** 更新分页信息 */
  updatePagination: (pagination: { page?: number; limit?: number }) => void;
  /** 清空筛选条件 */
  clearFilters: () => void;
  /** 是否有激活的筛选条件 */
  hasActiveFilters: boolean;
}

/**
 * 激活码筛选状态管理 Hook
 *
 * @description
 * 提供筛选条件的状态管理和 URL 同步功能
 * - 从 URL 参数初始化筛选条件
 * - 支持手动查询模式（不自动触发 API）
 * - 筛选条件变化时同步到 URL
 * - 分页信息独立管理
 *
 * @returns {UseActivationCodeFiltersReturn} 筛选状态和操作方法
 *
 * @example
 * ```tsx
 * const {
 *   filters,
 *   searchFilters,
 *   updatePagination,
 *   clearFilters,
 *   hasActiveFilters
 * } = useActivationCodeFilters();
 *
 * // 手动查询
 * <Button onClick={() => searchFilters({ type: 0, status: 1 })}>
 *   查询
 * </Button>
 *
 * // 更新分页
 * <Pagination
 *   onPageChange={(page) => updatePagination({ page })}
 *   onPageSizeChange={(limit) => updatePagination({ limit, page: 1 })}
 * />
 * ```
 */
export function useActivationCodeFilters(): UseActivationCodeFiltersReturn {
  const searchParams = useSearchParams();
  const isUpdatingFromSearch = useRef(false);

  // 从 URL 参数初始化筛选条件
  const getFiltersFromURL = useCallback((): ActivationCodeFilters => {
    const activation_code = searchParams.get('activation_code') || '';
    const typeParam = searchParams.get('type');
    const statusParam = searchParams.get('status');
    const page = Number(searchParams.get('page')) || DEFAULT_FILTERS.page;
    const size = Number(searchParams.get('size')) || DEFAULT_FILTERS.size;

    // 解析 type 参数
    let type: number | 'all' = 'all';
    if (typeParam && typeParam !== 'all') {
      const parsedType = Number(typeParam);
      if (!isNaN(parsedType) && parsedType >= 0 && parsedType <= 3) {
        type = parsedType;
      }
    }

    // 解析 status 参数
    let status: number | 'all' = 'all';
    if (statusParam && statusParam !== 'all') {
      const parsedStatus = Number(statusParam);
      if (!isNaN(parsedStatus) && parsedStatus >= 0 && parsedStatus <= 3) {
        status = parsedStatus;
      }
    }

    return {
      ...DEFAULT_FILTERS,
      activation_code,
      type,
      status,
      page,
      size
    };
  }, [searchParams]);

  // 筛选条件状态
  const [filters, setFilters] =
    useState<ActivationCodeFilters>(getFiltersFromURL);

  // 监听 URL 变化，同步筛选条件
  useEffect(() => {
    if (!isUpdatingFromSearch.current) {
      setFilters(getFiltersFromURL());
    }
    isUpdatingFromSearch.current = false;
  }, [searchParams, getFiltersFromURL]);

  /**
   * 同步筛选条件到 URL
   * 使用 window.history.replaceState 避免触发 Next.js RSC 请求
   */
  const syncFiltersToURL = useCallback((newFilters: ActivationCodeFilters) => {
    isUpdatingFromSearch.current = true;
    const params = new URLSearchParams();

    // 激活码
    if (newFilters.activation_code) {
      params.set('activation_code', newFilters.activation_code);
    }

    // 类型
    if (newFilters.type !== undefined && newFilters.type !== 'all') {
      params.set('type', String(newFilters.type));
    }

    // 状态
    if (newFilters.status !== undefined && newFilters.status !== 'all') {
      params.set('status', String(newFilters.status));
    }

    // 分页
    if (newFilters.page && newFilters.page !== 1) {
      params.set('page', String(newFilters.page));
    }
    if (newFilters.size && newFilters.size !== DEFAULT_FILTERS.size) {
      params.set('size', String(newFilters.size));
    }

    // 注意：时间范围不同步到 URL（使用 Date 对象）

    // 使用原生 API 更新 URL，避免触发 Next.js 导航和 RSC 请求
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, []);

  /**
   * 手动执行查询（更新筛选条件并同步 URL）
   */
  const searchFilters = useCallback(
    (newFilters: Partial<ActivationCodeFilters>) => {
      const updatedFilters: ActivationCodeFilters = {
        ...filters,
        ...newFilters,
        // 筛选条件变化时重置到第1页
        page: newFilters.page !== undefined ? newFilters.page : 1
      };

      setFilters(updatedFilters);
      syncFiltersToURL(updatedFilters);
    },
    [filters, syncFiltersToURL]
  );

  /**
   * 更新分页信息
   */
  const updatePagination = useCallback(
    (pagination: { page?: number; limit?: number }) => {
      const updatedFilters: ActivationCodeFilters = {
        ...filters,
        page: pagination.page,
        size: pagination.limit // 前端使用 limit，转换为 size 存储
      };

      setFilters(updatedFilters);
      syncFiltersToURL(updatedFilters);
    },
    [filters, syncFiltersToURL]
  );

  /**
   * 清空筛选条件
   */
  const clearFilters = useCallback(() => {
    const resetFilters: ActivationCodeFilters = {
      ...DEFAULT_FILTERS,
      page: 1,
      size: filters.size // 保留每页数量设置
    };

    setFilters(resetFilters);
    syncFiltersToURL(resetFilters);
  }, [filters.size, syncFiltersToURL]);

  /**
   * 检查是否有激活的筛选条件
   */
  const hasActiveFilters =
    !!filters.activation_code ||
    (filters.type !== 'all' && filters.type !== undefined) ||
    (filters.status !== 'all' && filters.status !== undefined) ||
    !!filters.distributedDateRange ||
    !!filters.activatedDateRange ||
    !!filters.expireDateRange;

  return {
    filters,
    searchFilters,
    updatePagination,
    clearFilters,
    hasActiveFilters
  };
}
