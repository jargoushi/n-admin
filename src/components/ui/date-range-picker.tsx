/**
 * 日期范围选择器组件
 *
 * @description
 * 通用的日期范围选择器，支持选择开始和结束日期
 * 基于 Popover + Calendar 组件实现
 *
 * @example
 * ```typescript
 * <DateRangePicker
 *   label="创建时间"
 *   value={dateRange}
 *   onChange={setDateRange}
 *   placeholder="选择时间范围"
 * />
 * ```
 */

'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

/**
 * 日期范围类型
 */
export interface DateRange {
  /** 开始日期 */
  from: Date;
  /** 结束日期 */
  to: Date;
}

/**
 * 日期范围选择器组件属性
 */
export interface DateRangePickerProps {
  /** 标签文本（可选） */
  label?: string;
  /** 日期范围值 */
  value?: DateRange;
  /** 值变化回调 */
  onChange: (range?: DateRange) => void;
  /** 占位符文本 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 日期格式（默认：'yyyy-MM-dd'） */
  dateFormat?: string;
  /** 显示月份数量（默认：2） */
  numberOfMonths?: number;
}

/**
 * 日期范围选择器组件
 *
 * @param props - 组件属性
 * @returns 日期范围选择器组件
 */
export function DateRangePicker({
  label,
  value,
  onChange,
  placeholder = '选择日期范围',
  disabled = false,
  className,
  dateFormat = 'yyyy-MM-dd',
  numberOfMonths = 2
}: DateRangePickerProps) {
  /**
   * 格式化日期范围显示文本
   */
  const getDisplayText = (): string => {
    if (value?.from && value?.to) {
      const fromStr = format(value.from, dateFormat);
      const toStr = format(value.to, dateFormat);
      return `${fromStr} - ${toStr}`;
    }
    return placeholder;
  };

  /**
   * 处理日期范围选择
   */
  const handleSelect = (dateRange: DateRange | undefined) => {
    onChange(dateRange);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* 标签 */}
      {label && <Label>{label}</Label>}

      {/* 日期选择器 */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {getDisplayText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='range'
            selected={value}
            onSelect={handleSelect}
            numberOfMonths={numberOfMonths}
            locale={zhCN}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
