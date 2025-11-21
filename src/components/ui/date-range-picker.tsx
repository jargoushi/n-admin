'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { SelectRangeEventHandler } from 'react-day-picker';

// 导入 shadcn/ui 基础组件
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export type DateRangeValue = {
  from: Date | undefined;
  to: Date | undefined;
};

interface DateRangePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 当前选中的日期范围 */
  value?: DateRangeValue;
  /** 日期范围变化时的回调 (只在 from/to 完整时触发) */
  onChange: (range: DateRangeValue | undefined) => void;
  /** 占位符文本 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** Popover 对齐方式 */
  align?: 'start' | 'center' | 'end';
}

/**
 * 日期范围选择器组件
 */
export function DateRangePicker({
  className,
  value,
  onChange,
  placeholder = '选择日期范围',
  disabled,
  align = 'start',
  ...props
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // 1. 内部状态：用于跟踪日历的实时选择（包括部分选择），以确保日历功能正常
  const [internalRange, setInternalRange] = React.useState<
    DateRangeValue | undefined
  >(value);

  // 2. 外部 value 变化时，同步到内部状态
  React.useEffect(() => {
    setInternalRange(value);
  }, [value]);

  // 处理日期选择变化
  const handleSelect: SelectRangeEventHandler = (range) => {
    // 始终更新内部状态，以确保日历组件能正确显示和继续选择
    const newInternalRange = range
      ? { from: range.from, to: range.to }
      : undefined;
    setInternalRange(newInternalRange);

    // 🚀 核心逻辑：只在完整选择或清空时调用外部 onChange
    if (range?.from && range.to) {
      // 完整选择：通知父组件，关闭 Popover
      onChange(newInternalRange);
      setIsOpen(false);
    } else if (!range) {
      // 清空选择：通知父组件，关闭 Popover
      onChange(undefined);
      setIsOpen(false);
    }
    // 如果是部分选择 (只有 from)，则不调用外部 onChange，Popover 保持打开
  };

  // 清空按钮逻辑 (需要同时清空外部和内部 state)
  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(undefined);
    setInternalRange(undefined);
    setIsOpen(false);
  };

  // 格式化显示的值 (使用内部状态进行显示)
  const displayValue = React.useMemo(() => {
    if (!internalRange?.from) {
      return placeholder;
    }
    const formattedFrom = format(internalRange.from, 'yyyy-MM-dd');

    // 移除 '至今'，显示提示
    const formattedTo = internalRange.to
      ? format(internalRange.to, 'yyyy-MM-dd')
      : '请选择结束日期';

    return `${formattedFrom} - ${formattedTo}`;
  }, [internalRange, placeholder]);

  // hasCompleteValue 依赖外部 value，因为外部 value 只有在完整选择时才会更新
  const hasCompleteValue = !!value?.from && !!value?.to;

  return (
    <div className={cn('grid w-full', className)} {...props}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'h-9 w-full justify-start pr-3 text-left font-normal',
              !hasCompleteValue && 'text-muted-foreground' // 使用 hasCompleteValue
            )}
            disabled={disabled}
          >
            <CalendarIcon className='mr-2 h-4 w-4 shrink-0' />
            <span className='flex-1 truncate overflow-hidden'>
              {displayValue}
            </span>

            {/* 只有在完整选择时才显示清空按钮 */}
            {hasCompleteValue && (
              <X
                className='text-muted-foreground hover:text-foreground ml-2 h-4 w-4 shrink-0 transition-colors'
                onClick={handleClear}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align={align}>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={internalRange?.from} // 使用 internalRange
            selected={internalRange} // 使用 internalRange
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
