/**
 * 激活码筛选组件
 *
 * @description
 * 提供激活码列表的搜索和筛选功能
 * - 第一行：常用筛选字段（激活码、类型、状态）+ 操作按钮
 * - 第二行：时间范围筛选（可展开/收起）
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import type { ActivationCodeFilters as ActivationCodeFiltersType } from '../types';
import {
  ACTIVATION_CODE_TYPE_OPTIONS,
  ACTIVATION_CODE_STATUS_OPTIONS,
  MESSAGES
} from '../constants';

/**
 * 筛选组件属性
 */
interface ActivationCodeFiltersProps {
  /** 筛选条件值 */
  filters: ActivationCodeFiltersType;
  /** 查询回调 */
  onSearch: (filters: Partial<ActivationCodeFiltersType>) => void;
  /** 重置回调 */
  onReset: () => void;
  /** 加载状态 */
  loading?: boolean;
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
  loading = false
}: ActivationCodeFiltersProps) {
  // 本地表单状态
  const [formData, setFormData] = useState<ActivationCodeFiltersType>({
    activation_code: '',
    type: 'all',
    status: 'all',
    distributedDateRange: undefined,
    activatedDateRange: undefined,
    expireDateRange: undefined,
    page: 1,
    size: 10
  });

  // 控制展开/收起
  const [showMore, setShowMore] = useState(false);

  // 同步外部 filters 到本地表单状态
  useEffect(() => {
    setFormData({
      activation_code: filters.activation_code || '',
      type: filters.type || 'all',
      status: filters.status || 'all',
      distributedDateRange: filters.distributedDateRange,
      activatedDateRange: filters.activatedDateRange,
      expireDateRange: filters.expireDateRange,
      page: filters.page || 1,
      size: filters.size || 10
    });
  }, [filters]);

  /**
   * 更新表单字段值
   */
  const updateFormField = (
    key: keyof ActivationCodeFiltersType,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  /**
   * 执行查询
   */
  const handleSearch = () => {
    onSearch({
      ...formData,
      page: 1 // 查询时重置到第一页
    });
  };

  /**
   * 重置筛选条件
   */
  const handleReset = () => {
    const resetData: ActivationCodeFiltersType = {
      activation_code: '',
      type: 'all',
      status: 'all',
      distributedDateRange: undefined,
      activatedDateRange: undefined,
      expireDateRange: undefined,
      page: 1,
      size: 10
    };
    setFormData(resetData);
    onReset();
  };

  /**
   * 快速搜索（回车键）
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      handleSearch();
    }
  };

  /**
   * 检查是否有激活的筛选条件
   */
  const hasActiveFilters = Boolean(
    formData.activation_code ||
      (formData.type && formData.type !== 'all') ||
      (formData.status && formData.status !== 'all') ||
      formData.distributedDateRange ||
      formData.activatedDateRange ||
      formData.expireDateRange
  );

  return (
    <div className='space-y-4'>
      {/* 第一行：常显筛选字段 + 操作按钮 */}
      <div className='grid grid-cols-1 items-end gap-4 md:grid-cols-12'>
        {/* 激活码 */}
        <div className='space-y-2 md:col-span-3'>
          <Label>激活码</Label>
          <Input
            placeholder={MESSAGES.PLACEHOLDER.SEARCH}
            value={formData.activation_code || ''}
            onChange={(e) => updateFormField('activation_code', e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />
        </div>

        {/* 激活码类型 */}
        <div className='space-y-2 md:col-span-2'>
          <Label>类型</Label>
          <Select
            value={String(formData.type)}
            onValueChange={(value) =>
              updateFormField('type', value === 'all' ? 'all' : Number(value))
            }
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder={MESSAGES.PLACEHOLDER.SELECT_TYPE} />
            </SelectTrigger>
            <SelectContent>
              {ACTIVATION_CODE_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 激活码状态 */}
        <div className='space-y-2 md:col-span-2'>
          <Label>状态</Label>
          <Select
            value={String(formData.status)}
            onValueChange={(value) =>
              updateFormField('status', value === 'all' ? 'all' : Number(value))
            }
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder={MESSAGES.PLACEHOLDER.SELECT_STATUS} />
            </SelectTrigger>
            <SelectContent>
              {ACTIVATION_CODE_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 操作按钮区域 */}
        <div className='flex items-center justify-end gap-2 md:col-span-5'>
          <Button onClick={handleSearch} disabled={loading} size='default'>
            <Search className='mr-2 h-4 w-4' />
            查询
          </Button>

          {hasActiveFilters && (
            <Button
              variant='outline'
              onClick={handleReset}
              disabled={loading}
              size='default'
            >
              <RotateCcw className='mr-2 h-4 w-4' />
              重置
            </Button>
          )}

          <Button
            variant='ghost'
            onClick={() => setShowMore(!showMore)}
            size='default'
            className='gap-1'
          >
            {showMore ? (
              <>
                收起
                <ChevronUp className='h-4 w-4' />
              </>
            ) : (
              <>
                展开
                <ChevronDown className='h-4 w-4' />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 第二行：时间范围筛选（展开区域） */}
      {showMore && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <DateRangePicker
            label='分发时间范围'
            value={formData.distributedDateRange}
            onChange={(range) => updateFormField('distributedDateRange', range)}
            placeholder='选择分发时间范围'
            disabled={loading}
          />

          <DateRangePicker
            label='激活时间范围'
            value={formData.activatedDateRange}
            onChange={(range) => updateFormField('activatedDateRange', range)}
            placeholder='选择激活时间范围'
            disabled={loading}
          />

          <DateRangePicker
            label='过期时间范围'
            value={formData.expireDateRange}
            onChange={(range) => updateFormField('expireDateRange', range)}
            placeholder='选择过期时间范围'
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
}
