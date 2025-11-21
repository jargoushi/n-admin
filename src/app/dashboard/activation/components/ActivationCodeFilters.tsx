/**
 * 激活码筛选组件
 *
 * @description
 * 使用 FilterLayout 通用组件实现筛选功能
 * 内部使用表单状态支持 'all' 选项和日期选择器
 * 查询时转换为后端 ActivationCodeQueryRequest 格式
 */

'use client';

import React from 'react';
import type { ActivationCodeQueryRequest } from '../types';
import {
  ACTIVATION_CODE_TYPE_OPTIONS,
  ACTIVATION_CODE_STATUS_OPTIONS
} from '../constants';
import {
  FilterLayout,
  FilterFieldConfig
} from '@/components/shared/filter-layout';

/**
 * 内部表单状态类型
 * 支持前端 UI 需要的 'all' 选项和 Date 对象
 */
interface InternalFormData {
  /** 激活码（精准匹配） */
  activation_code?: string;
  /** 激活码类型 (0-3 或 'all') */
  type?: number | 'all';
  /** 激活码状态 (0-3 或 'all') */
  status?: number | 'all';
  /** 分发时间范围 */
  distributedDateRange?: { from: Date; to: Date };
  /** 激活时间范围 */
  activatedDateRange?: { from: Date; to: Date };
  /** 过期时间范围 */
  expireDateRange?: { from: Date; to: Date };
}

/**
 * 默认内部表单状态
 */
const DEFAULT_INTERNAL_FORM_DATA: InternalFormData = {
  activation_code: '',
  type: 'all',
  status: 'all',
  distributedDateRange: undefined,
  activatedDateRange: undefined,
  expireDateRange: undefined
};

/**
 * 筛选组件属性
 */
interface ActivationCodeFiltersProps {
  /** 筛选条件值（后端格式） */
  filters: ActivationCodeQueryRequest;
  /** 查询回调（更新筛选条件并执行查询） */
  onSearch: (filters: Partial<ActivationCodeQueryRequest>) => void;
  /** 重置回调 */
  onReset: () => void;
  /** 加载状态 */
  loading?: boolean;
}

// 定义筛选配置
const FILTERS_CONFIG: FilterFieldConfig<keyof InternalFormData>[] = [
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
 * 将内部表单状态转换为后端 API 请求格式
 *
 * @param formData - 内部表单状态
 * @returns 后端 API 请求参数
 */
function convertToQueryRequest(
  formData: InternalFormData
): Partial<ActivationCodeQueryRequest> {
  const result: Partial<ActivationCodeQueryRequest> = {};

  // 激活码精确匹配（空字符串时显式设置为 undefined）
  result.activation_code = formData.activation_code || undefined;

  // 类型筛选（'all' 时显式设置为 undefined，用于清除 URL 参数）
  result.type =
    formData.type !== undefined && formData.type !== 'all'
      ? formData.type
      : undefined;

  // 状态筛选（'all' 时显式设置为 undefined，用于清除 URL 参数）
  result.status =
    formData.status !== undefined && formData.status !== 'all'
      ? formData.status
      : undefined;

  // 分发时间范围（无值时显式设置为 undefined，用于清除 URL 参数）
  if (formData.distributedDateRange) {
    result.distributed_at_start =
      formData.distributedDateRange.from.toISOString();
    result.distributed_at_end = formData.distributedDateRange.to.toISOString();
  } else {
    result.distributed_at_start = undefined;
    result.distributed_at_end = undefined;
  }

  // 激活时间范围（无值时显式设置为 undefined，用于清除 URL 参数）
  if (formData.activatedDateRange) {
    result.activated_at_start = formData.activatedDateRange.from.toISOString();
    result.activated_at_end = formData.activatedDateRange.to.toISOString();
  } else {
    result.activated_at_start = undefined;
    result.activated_at_end = undefined;
  }

  // 过期时间范围（无值时显式设置为 undefined，用于清除 URL 参数）
  if (formData.expireDateRange) {
    result.expire_time_start = formData.expireDateRange.from.toISOString();
    result.expire_time_end = formData.expireDateRange.to.toISOString();
  } else {
    result.expire_time_start = undefined;
    result.expire_time_end = undefined;
  }

  return result;
}

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
  // 内部状态用于暂存变动，直到点击"查询"
  const [formData, setFormData] = React.useState<InternalFormData>(
    DEFAULT_INTERNAL_FORM_DATA
  );

  // 将外部 filters 同步到内部状态（例如 URL 变化或重置）
  React.useEffect(() => {
    setFormData({
      activation_code: filters.activation_code ?? '',
      type: filters.type ?? 'all',
      status: filters.status ?? 'all',
      // 日期范围需要从 ISO 字符串转换回 Date 对象
      distributedDateRange:
        filters.distributed_at_start && filters.distributed_at_end
          ? {
              from: new Date(filters.distributed_at_start),
              to: new Date(filters.distributed_at_end)
            }
          : undefined,
      activatedDateRange:
        filters.activated_at_start && filters.activated_at_end
          ? {
              from: new Date(filters.activated_at_start),
              to: new Date(filters.activated_at_end)
            }
          : undefined,
      expireDateRange:
        filters.expire_time_start && filters.expire_time_end
          ? {
              from: new Date(filters.expire_time_start),
              to: new Date(filters.expire_time_end)
            }
          : undefined
    });
  }, [filters]);

  /**
   * 字段变化处理函数
   * @description
   * 处理 FilterLayout 传回的原始值，并进行必要的类型转换后，更新本地状态。
   */
  const handleFieldChange = React.useCallback(
    (key: keyof InternalFormData, value: unknown) => {
      let finalValue: InternalFormData[typeof key] =
        value as InternalFormData[typeof key];

      // 针对 Select 字段进行 String/Number/All 转换
      if (key === 'type' || key === 'status') {
        if (value === 'all') {
          // 'all' 保持为 'all'
          finalValue = 'all';
        } else if (typeof value === 'string' && value !== '') {
          // 将 string 类型的数字转换为 number (例如 '1' -> 1)
          const numValue = Number(value);
          // 验证转换结果，如果是 NaN 则回退到 'all'
          finalValue = Number.isNaN(numValue) ? 'all' : numValue;
        } else if (value === '') {
          // 处理 Select 清空
          finalValue = 'all';
        }
      }
      // DateRangeValue 和 string（activation_code）可以直接赋值

      setFormData((prev) => ({
        ...prev,
        [key]: finalValue
      }));
    },
    []
  );

  // 最终的查询动作：将内部状态转换为后端格式
  const handleSearch = React.useCallback(() => {
    const queryParams = convertToQueryRequest(formData);
    onSearch(queryParams);
  }, [onSearch, formData]);

  return (
    <FilterLayout<InternalFormData>
      config={FILTERS_CONFIG}
      formData={formData}
      onFieldChange={handleFieldChange}
      onSearch={handleSearch}
      onReset={onReset}
      loading={loading}
    />
  );
}
