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

/**
 * DateRange 类型定义 (保持一致)
 */
export interface DateRange {
  from?: Date;
  to?: Date;
}

interface DateRangePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
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
  const [internalRange, setInternalRange] = React.useState<
    DateRange | undefined
  >(value);

  React.useEffect(() => {
    setInternalRange(value);
  }, [value]);

  const handleSelect: SelectRangeEventHandler = (range) => {
    setInternalRange(range);

    if (range?.from && range?.to) {
      onChange(range as DateRange);
      setIsOpen(false);
    } else if (!range?.from && !range?.to) {
      onChange(undefined);
    }
  };

  /**
   * 清空操作处理函数
   */
  const handleClear = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // 阻止冒泡是必要的安全措施
      e.stopPropagation();

      setInternalRange(undefined);
      onChange(undefined);

      setIsOpen(false);
    },
    [onChange]
  );

  // 显示值的计算
  const displayValue = React.useMemo(() => {
    if (value?.from && value?.to) {
      const start = format(value.from, 'yyyy-MM-dd');
      const end = format(value.to, 'yyyy-MM-dd');
      return `${start} ~ ${end}`;
    }
    return placeholder;
  }, [value, placeholder]);

  const hasCompleteValue = !!value?.from && !!value?.to;

  return (
    <div className={cn('grid w-full', className)} {...props}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'relative h-9 w-full justify-start pr-3 text-left font-normal',
              !hasCompleteValue && 'text-muted-foreground'
            )}
            disabled={disabled}
          >
            <CalendarIcon className='mr-2 h-4 w-4 shrink-0' />
            <span className='flex-1 truncate overflow-hidden'>
              {displayValue}
            </span>

            {hasCompleteValue && !disabled && (
              <div
                className='absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer p-1'
                onClick={handleClear}
                title='清空日期范围'
              >
                <X className='text-muted-foreground hover:text-foreground h-4 w-4 shrink-0 transition-colors' />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align={align}>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={internalRange?.from}
            selected={internalRange as any}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
