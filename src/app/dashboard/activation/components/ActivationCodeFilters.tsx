/**
 * 激活码筛选组件
 *
 * @description
 * 使用 FilterLayout 通用组件 + react-hook-form 实现筛选功能
 * 表单类型直接使用后端 ActivationCodeQueryRequest 格式，无需转换
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import type { ActivationCodeQueryRequest } from '../types';
import {
  ACTIVATION_CODE_TYPE_OPTIONS,
  ACTIVATION_CODE_STATUS_OPTIONS,
  DEFAULT_QUERY_PARAMS
} from '../constants';
import {
  FilterLayout,
  FilterFieldConfig
} from '@/components/shared/filter-layout';

/**
 * 筛选组件属性
 */
interface ActivationCodeFiltersProps {
  /** 筛选条件值（后端格式） */
  filters: ActivationCodeQueryRequest;
  /** 查询回调（更新筛选条件执行查询） */
  onSearch: (filters: Partial<ActivationCodeQueryRequest>) => void;
  /** 重置回调（清空所有筛选条件） */
  onReset: () => void;
}

/**
 * 筛选字段配置
 */
const FILTERS_CONFIG: FilterFieldConfig<ActivationCodeQueryRequest>[] = [
  {
    key: 'activation_code',
    label: '激活码',
    type: 'input',
    placeholder: '请输入激活码进行精确搜索'
  },
  {
    key: 'type',
    label: '类型',
    type: 'select',
    options: ACTIVATION_CODE_TYPE_OPTIONS,
    placeholder: '请选择激活码类型'
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: ACTIVATION_CODE_STATUS_OPTIONS,
    placeholder: '请选择激活码状态'
  },
  // --- 高级筛选：时间范围 ---
  {
    startKey: 'distributed_at_start',
    endKey: 'distributed_at_end',
    label: '分发时间范围',
    type: 'date-range',
    placeholder: '选择分发时间范围',
    advanced: true
  },
  {
    startKey: 'activated_at_start',
    endKey: 'activated_at_end',
    label: '激活时间范围',
    type: 'date-range',
    placeholder: '选择激活时间范围',
    advanced: true
  },
  {
    startKey: 'expire_time_start',
    endKey: 'expire_time_end',
    label: '过期时间范围',
    type: 'date-range',
    placeholder: '选择过期时间范围',
    advanced: true
  }
];

/**
 * 激活码筛选组件
 */
export function ActivationCodeFilters({
  filters,
  onSearch,
  onReset
}: ActivationCodeFiltersProps) {
  // 使用 react-hook-form 管理表单状态
  const { control, handleSubmit, reset } = useForm<ActivationCodeQueryRequest>({
    defaultValues: filters
  });

  // 同步外部 filters 变化（如 URL 参数变化或重置）
  React.useEffect(() => {
    reset(filters);
  }, [filters, reset]);

  // 重置处理：需要同时重置表单内部状态和外部状态
  const handleReset = React.useCallback(() => {
    reset(DEFAULT_QUERY_PARAMS);
    onReset();
  }, [onReset, reset]);

  return (
    <FilterLayout<ActivationCodeQueryRequest>
      config={FILTERS_CONFIG}
      control={control}
      handleSubmit={handleSubmit}
      onSearch={onSearch}
      onReset={handleReset}
    />
  );
}
