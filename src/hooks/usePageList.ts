/**
 * 通用分页列表管理 Hook
 *
 * @description
 * 统一管理分页列表的筛选、加载和刷新逻辑
 * - 使用 nuqs 管理 URL 查询参数
 * - 自动加载数据
 * - 提供刷新和搜索方法
 *
 * @template T - 列表项类型
 * @template F - 筛选参数类型 (必须继承 PageRequest)
 *
 * @param apiService - API 服务方法,接收筛选参数并返回分页响应
 * @param defaultFilters - 默认筛选条件
 * @param parsers - nuqs 解析器配置,用于类型转换
 *
 * @returns 筛选状态、列表数据和操作方法
 *
 * @example
 * ```tsx
 * // 定义筛选参数解析器
 * const filterParsers = {
 *   page: parseAsInteger.withDefault(1),
 *   size: parseAsInteger.withDefault(10),
 *   status: parseAsInteger,
 *   keyword: parseAsString
 * };
 *
 * // 使用 Hook
 * const {
 *   filters,
 *   setFilters,
 *   resetFilters,
 *   items,
 *   loading,
 *   pagination,
 *   refresh
 * } = usePageList(
 *   UserApiService.getPageList,
 *   { page: 1, size: 10 },
 *   filterParsers
 * );
 * ```
 */

'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useQueryStates } from 'nuqs';
import type { PageResponse, PageRequest } from '@/lib/http/types';
import { DEFAULT_PAGINATION } from '@/constants/pagination';

/**
 * Hook 返回值类型
 */
export interface UsePageListReturn<T, F extends PageRequest> {
  /** 当前筛选条件 */
  filters: F;
  /** 更新筛选条件 (部分更新) */
  setFilters: (filters: Partial<F>) => void;
  /** 搜索 (重置页码到第一页) */
  search: (filters: Partial<F>) => void;
  /** 重置筛选条件 */
  resetFilters: () => void;
  /** 列表数据 */
  items: T[];
  /** 加载状态 */
  loading: boolean;
  /** 分页信息 */
  pagination: Omit<PageResponse<T>, 'items'>;
  /** 刷新当前数据 */
  refresh: () => void;
}

/**
 * 通用分页列表管理 Hook
 */
export function usePageList<T, F extends PageRequest>(
  apiService: (params: F) => Promise<PageResponse<T>>,
  defaultFilters: F,
  parsers: any // nuqs parsers 配置
): UsePageListReturn<T, F> {
  // 使用 nuqs 管理 URL 查询参数
  const [urlFilters, setUrlFilters] = useQueryStates(parsers, {
    history: 'replace' // 使用 replace 避免历史记录堆积
  });

  // 使用 useMemo 缓存 filters,避免每次渲染创建新对象
  const filters = useMemo(
    () => ({ ...defaultFilters, ...urlFilters }) as F,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(urlFilters)]
  );

  // 列表数据状态
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] =
    useState<Omit<PageResponse<T>, 'items'>>(DEFAULT_PAGINATION);

  // 使用 ref 保存 apiService,避免作为依赖
  const apiServiceRef = useRef(apiService);
  apiServiceRef.current = apiService;

  // 获取列表数据
  const fetchList = useCallback(async (params: F) => {
    setLoading(true);

    try {
      const response = await apiServiceRef.current(params);
      const { items: responseItems, ...paginationInfo } = response;
      setItems(responseItems);
      setPagination(paginationInfo);
    } finally {
      setLoading(false);
    }
  }, []);

  // 更新筛选条件
  const setFilters = useCallback(
    (newFilters: Partial<F>) => {
      setUrlFilters(newFilters as any);
    },
    [setUrlFilters]
  );

  // 搜索时自动重置页码
  const search = useCallback(
    (newFilters: Partial<F>) => {
      setUrlFilters({ ...newFilters, page: 1 } as any);
    },
    [setUrlFilters]
  );

  // 重置筛选条件
  const resetFilters = useCallback(() => {
    setUrlFilters(defaultFilters as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUrlFilters]);

  // 刷新当前数据
  const refresh = useCallback(() => {
    fetchList(filters);
  }, [filters, fetchList]);

  // 监听筛选条件变化,自动加载数据
  // 使用 JSON.stringify 作为依赖,避免对象引用变化导致无限循环
  useEffect(() => {
    fetchList(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return {
    filters,
    setFilters,
    search,
    resetFilters,
    items,
    loading,
    pagination,
    refresh
  };
}
