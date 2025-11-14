/**
 * 激活码筛选组件
 *
 * @description
 * 提供激活码列表的搜索和筛选功能
 * - 快速搜索：激活码精确匹配
 * - 高级筛选：类型、状态、时间范围
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, RotateCcw, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { AdvancedFilterContainer } from '@/components/shared/advanced-filter-container';
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
 * @description
 * 双层筛选架构：
 * 1. 快速搜索栏：激活码精确匹配
 * 2. 高级筛选抽屉：类型、状态、时间范围
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

  // 控制高级筛选抽屉
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

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

  /**
   * 渲染快速搜索栏
   */
  const renderQuickSearch = () => (
    <div className='flex items-center gap-3'>
      {/* 激活码搜索 */}
      <div className='relative max-w-sm flex-1'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          placeholder={MESSAGES.PLACEHOLDER.SEARCH}
          value={formData.activation_code || ''}
          onChange={(e) => updateFormField('activation_code', e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
          className='pl-10'
        />
      </div>

      {/* 查询按钮 */}
      <Button
        onClick={handleSearch}
        disabled={loading}
        className='shrink-0 cursor-pointer'
      >
        <Search className='mr-2 h-4 w-4' />
        查询
      </Button>

      {/* 高级筛选按钮 */}
      <Button
        variant='outline'
        onClick={() => setIsAdvancedFilterOpen(true)}
        className='shrink-0 cursor-pointer'
      >
        <Filter className='mr-2 h-4 w-4' />
        高级筛选
        {hasActiveFilters && (
          <span className='bg-primary ml-2 h-2 w-2 rounded-full' />
        )}
      </Button>

      {/* 重置按钮 */}
      {hasActiveFilters && (
        <Button
          variant='ghost'
          onClick={handleReset}
          disabled={loading}
          className='text-muted-foreground hover:text-foreground shrink-0 cursor-pointer'
        >
          <RotateCcw className='mr-1 h-4 w-4' />
          重置
        </Button>
      )}
    </div>
  );

  /**
   * 渲染高级筛选表单内容
   */
  const renderAdvancedFilterForm = () => (
    <div className='grid gap-4'>
      {/* 第一行：激活码和类型 */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label>激活码</Label>
          <Input
            placeholder={MESSAGES.PLACEHOLDER.SEARCH}
            value={formData.activation_code || ''}
            onChange={(e) => updateFormField('activation_code', e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>

        <div className='space-y-2'>
          <Label>激活码类型</Label>
          <Select
            value={String(formData.type)}
            onValueChange={(value) =>
              updateFormField('type', value === 'all' ? 'all' : Number(value))
            }
          >
            <SelectTrigger className='w-full'>
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
      </div>

      {/* 第二行：状态 */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label>激活码状态</Label>
          <Select
            value={String(formData.status)}
            onValueChange={(value) =>
              updateFormField('status', value === 'all' ? 'all' : Number(value))
            }
          >
            <SelectTrigger className='w-full'>
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
      </div>

      {/* 第三行：分发时间范围 */}
      <div className='grid grid-cols-1 gap-4'>
        <div className='space-y-2'>
          <Label>分发时间范围</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !formData.distributedDateRange && 'text-muted-foreground'
                )}
              >
                <Calendar className='mr-2 h-4 w-4' />
                {formData.distributedDateRange &&
                formData.distributedDateRange.from &&
                formData.distributedDateRange.to
                  ? `${format(formData.distributedDateRange.from, 'yyyy-MM-dd')} - ${format(formData.distributedDateRange.to, 'yyyy-MM-dd')}`
                  : '选择分发时间范围'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <CalendarComponent
                mode='range'
                selected={formData.distributedDateRange}
                onSelect={(dateRange) =>
                  updateFormField('distributedDateRange', dateRange)
                }
                numberOfMonths={2}
                locale={zhCN}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 第四行：激活时间范围 */}
      <div className='grid grid-cols-1 gap-4'>
        <div className='space-y-2'>
          <Label>激活时间范围</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !formData.activatedDateRange && 'text-muted-foreground'
                )}
              >
                <Calendar className='mr-2 h-4 w-4' />
                {formData.activatedDateRange &&
                formData.activatedDateRange.from &&
                formData.activatedDateRange.to
                  ? `${format(formData.activatedDateRange.from, 'yyyy-MM-dd')} - ${format(formData.activatedDateRange.to, 'yyyy-MM-dd')}`
                  : '选择激活时间范围'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <CalendarComponent
                mode='range'
                selected={formData.activatedDateRange}
                onSelect={(dateRange) =>
                  updateFormField('activatedDateRange', dateRange)
                }
                numberOfMonths={2}
                locale={zhCN}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 第五行：过期时间范围 */}
      <div className='grid grid-cols-1 gap-4'>
        <div className='space-y-2'>
          <Label>过期时间范围</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !formData.expireDateRange && 'text-muted-foreground'
                )}
              >
                <Calendar className='mr-2 h-4 w-4' />
                {formData.expireDateRange &&
                formData.expireDateRange.from &&
                formData.expireDateRange.to
                  ? `${format(formData.expireDateRange.from, 'yyyy-MM-dd')} - ${format(formData.expireDateRange.to, 'yyyy-MM-dd')}`
                  : '选择过期时间范围'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <CalendarComponent
                mode='range'
                selected={formData.expireDateRange}
                onSelect={(dateRange) =>
                  updateFormField('expireDateRange', dateRange)
                }
                numberOfMonths={2}
                locale={zhCN}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );

  return (
    <div className='space-y-4'>
      {/* 快速搜索栏 */}
      {renderQuickSearch()}

      {/* 高级筛选弹窗 */}
      <AdvancedFilterContainer
        open={isAdvancedFilterOpen}
        onClose={() => setIsAdvancedFilterOpen(false)}
        title='激活码筛选'
        hasActiveFilters={hasActiveFilters}
        onSearch={handleSearch}
        onReset={handleReset}
        loading={loading}
      >
        {renderAdvancedFilterForm()}
      </AdvancedFilterContainer>
    </div>
  );
}
