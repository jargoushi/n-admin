'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp, Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DateRangePicker,
  DateRangeValue
} from '@/components/ui/date-range-picker';

interface BaseFieldConfig<K> {
  key: K;
  label: string;
  advanced?: boolean;
  placeholder?: string;
}
interface InputConfig<K> extends BaseFieldConfig<K> {
  type: 'input';
}
interface SelectConfig<K> extends BaseFieldConfig<K> {
  type: 'select';
  options: readonly { label: string; value: string | number }[];
}
interface DateRangeConfig<K> extends BaseFieldConfig<K> {
  type: 'date-range';
}

export type FilterFieldConfig<K> =
  | InputConfig<K>
  | SelectConfig<K>
  | DateRangeConfig<K>;

interface FilterLayoutProps<T extends Record<string, any>> {
  config: FilterFieldConfig<keyof T>[];
  formData: T;

  onFieldChange: (key: keyof T, value: any) => void;

  onSearch: () => void;
  onReset: () => void;
  loading?: boolean;
}

// 内部渲染逻辑
function FilterField<T extends Record<string, any>>({
  config,
  formData,
  onFieldChange,
  loading
}: {
  config: FilterFieldConfig<keyof T>;
  formData: T;
  onFieldChange: FilterLayoutProps<T>['onFieldChange'];
  loading?: boolean;
}) {
  const value = formData[config.key];
  const commonProps = {
    id: String(config.key),
    disabled: loading
  };

  // 🚀 核心：根据字段类型推断所需的列跨度 (基于 12 列网格)
  // 默认 Input/Select: 3/12 (标准 4 字段/行)
  let spanClass = 'col-span-full sm:col-span-6 md:col-span-3';

  if (config.type === 'date-range') {
    // DateRange: 4/12 (标准 3 字段/行)
    spanClass = 'col-span-full sm:col-span-6 md:col-span-4';
  }

  return (
    // 应用 spanClass 和 space-y-2
    <div key={String(config.key)} className={`${spanClass} space-y-2`}>
      <Label htmlFor={String(config.key)}>{config.label}</Label>

      {/* 1. Input 类型 */}
      {config.type === 'input' && (
        <Input
          {...commonProps}
          value={(value as string) || ''}
          onChange={(e) => onFieldChange(config.key, e.target.value)}
          placeholder={config.placeholder}
          className='h-9' // 修正高度，保持与 Select 和 DateRangePicker 一致
        />
      )}

      {/* 2. Select 类型 */}
      {config.type === 'select' && (
        <Select
          value={String(value)}
          onValueChange={(val) => {
            const newValue = typeof value === 'number' ? Number(val) : val;
            onFieldChange(config.key, newValue);
          }}
          {...commonProps}
        >
          <SelectTrigger className='h-9'>
            {' '}
            {/* 修正高度，保持一致 */}
            <SelectValue placeholder={config.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {config.options.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* 3. Date Range 类型 */}
      {config.type === 'date-range' && (
        <DateRangePicker
          value={value as DateRangeValue | undefined}
          onChange={(range) => onFieldChange(config.key, range)}
          placeholder={config.placeholder}
          {...commonProps}
        />
      )}
    </div>
  );
}

/**
 * 智能通用筛选器布局组件
 */
export function FilterLayout<T extends Record<string, any>>({
  config,
  formData,
  onFieldChange,
  onSearch,
  onReset,
  loading = false
}: FilterLayoutProps<T>) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const primaryFilters = config.filter((c) => !c.advanced);
  const advancedFilters = config.filter((c) => c.advanced);
  const showToggle = advancedFilters.length > 0;

  const renderFields = (fieldConfigs: FilterFieldConfig<keyof T>[]) =>
    fieldConfigs.map((c) => (
      <FilterField
        key={String(c.key)}
        config={c}
        formData={formData}
        onFieldChange={onFieldChange}
        loading={loading}
      />
    ));

  return (
    <div className='bg-card rounded-lg border p-4 shadow-sm'>
      <div className='flex flex-col gap-4 md:flex-row md:items-end'>
        {/* 🚀 布局优化：主筛选区域切换到 12 列网格，实现精确控制 */}
        <div className='grid flex-1 grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 md:grid-cols-12'>
          {renderFields(primaryFilters)}
        </div>

        {/* 操作按钮区：items-end 确保与输入框底部对齐 */}
        <div className='flex shrink-0 items-end gap-2'>
          <Button
            onClick={onSearch}
            disabled={loading}
            size='sm'
            className='h-9' // 确保高度与输入控件一致
          >
            <Search className='mr-2 h-4 w-4' />
            查询
          </Button>
          <Button
            variant='outline'
            onClick={onReset}
            disabled={loading}
            size='sm'
            className='h-9'
          >
            <RotateCcw className='mr-2 h-4 w-4' />
            重置
          </Button>

          {showToggle && (
            <Button
              variant='ghost'
              onClick={() => setIsExpanded(!isExpanded)}
              size='sm'
              className='h-9 gap-1'
            >
              {isExpanded ? '收起' : '展开'}
              {isExpanded ? (
                <ChevronUp className='h-4 w-4' />
              ) : (
                <ChevronDown className='h-4 w-4' />
              )}
            </Button>
          )}
        </div>
      </div>

      {isExpanded && showToggle && (
        <div className='mt-4 border-t pt-4'>
          {/* 🚀 布局优化：高级筛选区域切换到 12 列网格 */}
          <div className='grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 md:grid-cols-12'>
            {renderFields(advancedFilters)}
          </div>
        </div>
      )}
    </div>
  );
}
