/**
 * 激活码筛选组件
 *
 * @description
 * 使用 FilterLayout 通用组件实现筛选功能
 */

'use client';

import React from 'react';
import type { ActivationCodeFilters as ActivationCodeFiltersType } from '../types';
import {
  ACTIVATION_CODE_TYPE_OPTIONS,
  ACTIVATION_CODE_STATUS_OPTIONS
} from '../constants';
import {
  FilterLayout,
  FilterFieldConfig
} from '@/components/shared/filter-layout';

/**
 * 筛选组件属性
 */
interface ActivationCodeFiltersProps {
  /** 筛选条件值 */
  filters: ActivationCodeFiltersType;
  /** 查询回调（更新筛选条件并执行查询） */
  onSearch: (filters: Partial<ActivationCodeFiltersType>) => void;
  /** 重置回调 */
  onReset: () => void;
  /** 加载状态 */
  loading?: boolean;
}

// 定义筛选配置
const FILTERS_CONFIG: FilterFieldConfig<keyof ActivationCodeFiltersType>[] = [
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
  // --- Advanced/时间范围筛选 ---
  {
    key: 'distributedDateRange',
    label: '分发时间范围',
    type: 'date-range',
    placeholder: '选择分发时间范围',
    advanced: true
  },
  {
    key: 'activatedDateRange',
    label: '激活时间范围',
    type: 'date-range',
    placeholder: '选择激活时间范围',
    advanced: true
  },
  {
    key: 'expireDateRange',
    label: '过期时间范围',
    type: 'date-range',
    placeholder: '选择过期时间范围',
    advanced: true
  }
];

/**
 * 激活码筛选组件
 *
 * @param props - 组件属性
 * @returns 筛选组件
 */
export function ActivationCodeFilters({
  filters,
  onSearch,
  onReset,
  loading
}: ActivationCodeFiltersProps) {
  // 内部状态用于暂存变动，直到点击“查询”
  const [formData, setFormData] = React.useState(filters);

  // 确保 filters 变化时，内部状态同步（例如URL变化或重置）
  React.useEffect(() => {
    setFormData(filters);
  }, [filters]);

  /**
   * 字段变化处理函数
   * @description
   * 处理 FilterLayout 传回的原始值，并进行必要的类型转换后，更新本地状态。
   */
  const handleFieldChange = React.useCallback(
    (key: keyof ActivationCodeFiltersType, value: any) => {
      let finalValue: ActivationCodeFiltersType[typeof key] = value;

      // 针对 Select 字段进行 String/Number/All 转换
      if (key === 'type' || key === 'status') {
        if (value === 'all') {
          // 'all' 保持为 'all'
          finalValue = 'all';
        } else if (typeof value === 'string' && value !== '') {
          // 将 string 类型的数字转换为 number (例如 '1' -> 1)
          finalValue = Number(value);
        } else if (value === '') {
          // 处理 Select 清空（尽管我们通常不提供清空选项，但为了健壮性）
          finalValue = 'all';
        }
      }
      // DateRangeValue 和 string（activation_code）可以直接赋值

      setFormData((prev) => ({
        ...prev,
        [key]: finalValue as any
      }));
    },
    []
  );

  // 最终的查询动作
  const handleSearch = React.useCallback(() => {
    // 只有在点击“查询”时才触发外部的 onSearch
    onSearch(formData);
  }, [onSearch, formData]);

  return (
    <FilterLayout<ActivationCodeFiltersType>
      config={FILTERS_CONFIG}
      formData={formData}
      onFieldChange={handleFieldChange}
      onSearch={handleSearch}
      onReset={onReset}
      loading={loading}
    />
  );
}
