'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * 通用的 URL 筛选 Hook
 * @param initialFilters 默认筛选条件
 * @returns 筛选状态和操作方法
 */
export function useUrlFilters<T extends Record<string, any>>(
  initialFilters: T
) {
  const searchParams = useSearchParams();
  const isUpdatingRef = useRef(false);

  // 1. 初始化：优先从 URL 读取，否则使用默认值
  const initializeState = useCallback((): T => {
    const state = { ...initialFilters };

    // 遍历默认值的 key，尝试从 URL 获取对应的值
    Object.keys(initialFilters).forEach((key) => {
      const value = searchParams.get(key);
      if (value !== null) {
        // 简单的类型转换处理
        if (typeof initialFilters[key] === 'number') {
          const numValue = Number(value);
          if (!Number.isNaN(numValue)) {
            (state as any)[key] = numValue;
          }
        } else if (typeof initialFilters[key] === 'boolean') {
          (state as any)[key] = value === 'true';
        } else {
          (state as any)[key] = value;
        }
      }
    });
    return state;
  }, [searchParams, initialFilters]);

  const [filters, setFiltersState] = useState<T>(initializeState);

  // 2. 监听 URL 变化同步到 State (处理浏览器前进/后退)
  useEffect(() => {
    if (!isUpdatingRef.current) {
      setFiltersState(initializeState());
    }
    isUpdatingRef.current = false;
  }, [searchParams, initializeState]);

  // 3. 同步 State 到 URL
  const syncToURL = useCallback((newFilters: T) => {
    isUpdatingRef.current = true;
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      // 过滤掉 undefined, null, 空字符串, "all" 和 NaN
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        value !== 'all' &&
        !Number.isNaN(value)
      ) {
        params.set(key, String(value));
      }
    });

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState(null, '', newUrl);
  }, []);

  // 4. 更新筛选的方法
  const setFilters = useCallback(
    (newFilters: Partial<T>) => {
      setFiltersState((prev) => {
        const next = { ...prev, ...newFilters };
        syncToURL(next);
        return next;
      });
    },
    [syncToURL]
  );

  // 5. 重置方法
  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters);
    syncToURL(initialFilters);
  }, [initialFilters, syncToURL]);

  return {
    filters,
    setFilters,
    resetFilters
  };
}
