'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp, Search, RotateCcw, X } from 'lucide-react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  UseFormHandleSubmit,
  useWatch
} from 'react-hook-form';
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
import { DateRangePicker, DateRange } from '@/components/ui/date-range-picker';

// ==================== 类型常量导出 ====================

export const FILTER_TYPES = {
  INPUT: 'input',
  SELECT: 'select',
  DATE_RANGE: 'date-range'
} as const;

// ==================== 字段配置类型 ====================

interface BaseFieldConfig {
  /** 字段标签 */
  label: string;
  /** 是否为高级筛选（展开后显示） */
  advanced?: boolean;
  /** 占位符文本 */
  placeholder?: string;
}

/** 输入框配置 */
export interface InputConfig<T extends FieldValues> extends BaseFieldConfig {
  type: typeof FILTER_TYPES.INPUT;
  /** 字段键名 */
  key: Path<T>;
}

/** 下拉选择配置 */
export interface SelectConfig<T extends FieldValues> extends BaseFieldConfig {
  type: typeof FILTER_TYPES.SELECT;
  /** 字段键名 */
  key: Path<T>;
  /** 选项列表 */
  options: readonly { label: string; value: string | number }[];
}

/** 日期范围配置 */
export interface DateRangeConfig<T extends FieldValues>
  extends BaseFieldConfig {
  type: typeof FILTER_TYPES.DATE_RANGE;
  /** 开始日期键名 */
  startKey: Path<T>;
  /** 结束日期键名 */
  endKey: Path<T>;
}

export type FilterFieldConfig<T extends FieldValues> =
  | InputConfig<T>
  | SelectConfig<T>
  | DateRangeConfig<T>;

// ==================== 组件属性类型 ====================

interface FilterLayoutProps<T extends FieldValues> {
  config: FilterFieldConfig<T>[];
  control: Control<T>;
  handleSubmit: UseFormHandleSubmit<T>;
  onSearch: (data: T) => void;
  onReset: () => void;
  loading?: boolean;
}

// ==================== 辅助函数和组件 ====================

/**
 * 获取字段的唯一标识键
 */
function getFieldKey<T extends FieldValues>(
  config: FilterFieldConfig<T>
): string {
  return config.type === FILTER_TYPES.DATE_RANGE
    ? String(config.startKey)
    : String(config.key);
}

/**
 * 清除按钮组件
 */
function ClearButton({
  onClick,
  show
}: {
  onClick: () => void;
  show: boolean;
}) {
  if (!show) return null;
  return (
    <button
      type='button'
      onClick={onClick}
      className='hover:bg-accent absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-sm opacity-0 transition-opacity group-hover:opacity-100'
      title='清除'
    >
      <X className='text-muted-foreground hover:text-foreground h-4 w-4' />
    </button>
  );
}

/** 字段宽度映射 */
const FIELD_WIDTH = {
  [FILTER_TYPES.INPUT]: 'w-64',
  [FILTER_TYPES.SELECT]: 'w-30',
  [FILTER_TYPES.DATE_RANGE]: 'w-80'
} as const;

// ==================== 字段组件 ====================

/**
 * 输入框类型
 */
function FilterInput<T extends FieldValues>({
  config,
  control,
  loading
}: {
  config: InputConfig<T>;
  control: Control<T>;
  loading?: boolean;
}) {
  const fieldId = String(config.key);
  return (
    <Controller
      name={config.key}
      control={control}
      render={({ field }) => {
        const hasValue = Boolean(field.value);
        return (
          <div className='group relative'>
            <Input
              {...field}
              id={fieldId}
              value={(field.value as string) ?? ''}
              placeholder={config.placeholder}
              disabled={loading}
              className='h-9 w-full pr-8'
              onChange={(e) => field.onChange(e.target.value || undefined)}
            />
            <ClearButton
              onClick={() => field.onChange(undefined)}
              show={hasValue && !loading}
            />
          </div>
        );
      }}
    />
  );
}

/**
 * 下拉选择类型
 */
function FilterSelect<T extends FieldValues>({
  config,
  control,
  loading
}: {
  config: SelectConfig<T>;
  control: Control<T>;
  loading?: boolean;
}) {
  const fieldId = String(config.key);

  return (
    <Controller
      name={config.key}
      control={control}
      render={({ field }) => {
        const hasValue = field.value !== undefined && field.value !== null;

        return (
          <div className='group relative'>
            <Select
              value={field.value !== undefined ? String(field.value) : ''}
              onValueChange={(val) => {
                const option = config.options.find(
                  (opt) => String(opt.value) === val
                );
                field.onChange(option?.value);
              }}
              disabled={loading}
            >
              <SelectTrigger
                id={fieldId}
                className={`h-9 w-full ${hasValue ? 'group-hover:[&amp;>svg]:opacity-0' : ''}`}
              >
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
            <ClearButton
              onClick={() => field.onChange(undefined)}
              show={hasValue && !loading}
            />
          </div>
        );
      }}
    />
  );
}

/**
 * 日期范围类型
 */
function FilterDateRange<T extends FieldValues>({
  config,
  control,
  loading
}: {
  config: DateRangeConfig<T>;
  control: Control<T>;
  loading?: boolean;
}) {
  const fieldId = String(config.startKey);
  const { startKey, endKey, placeholder } = config;

  // 使用 useWatch 读取值
  const startValue = useWatch({ control, name: startKey });
  const endValue = useWatch({ control, name: endKey });

  // 构造 DateRange
  const value: DateRange | undefined =
    startValue && endValue
      ? {
          from: new Date(startValue as string),
          to: new Date(endValue as string)
        }
      : undefined;

  return (
    <Controller
      name={startKey}
      control={control}
      render={({ field: startField }) => (
        <Controller
          name={endKey}
          control={control}
          render={({ field: endField }) => {
            const handleChange = (range: DateRange | undefined) => {
              if (range?.from && range?.to) {
                startField.onChange(range.from.toISOString());
                endField.onChange(range.to.toISOString());
              } else {
                startField.onChange(undefined);
                endField.onChange(undefined);
              }
            };

            return (
              <div className='group relative'>
                <DateRangePicker
                  id={fieldId}
                  value={value}
                  onChange={handleChange}
                  placeholder={placeholder}
                  disabled={loading}
                />
              </div>
            );
          }}
        />
      )}
    />
  );
}

// ==================== 筛选字段渲染组件 ====================

/**
 * 单个筛选字段渲染组件
 */
function FilterField<T extends FieldValues>({
  config,
  control,
  loading
}: {
  config: FilterFieldConfig<T>;
  control: Control<T>;
  loading?: boolean;
}) {
  // 使用宽度映射
  const width = FIELD_WIDTH[config.type] || 'w-64';

  const renderField = () => {
    switch (config.type) {
      case FILTER_TYPES.INPUT:
        return (
          <FilterInput config={config} control={control} loading={loading} />
        );
      case FILTER_TYPES.SELECT:
        return (
          <FilterSelect config={config} control={control} loading={loading} />
        );
      case FILTER_TYPES.DATE_RANGE:
        return (
          <FilterDateRange
            config={config}
            control={control}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${width} flex-shrink-0`}>
      <div className='space-y-2'>
        <Label htmlFor={getFieldKey(config)}>{config.label}</Label>
        {renderField()}
      </div>
    </div>
  );
}

// ==================== 主组件 ====================

/**
 * 通用筛选器布局组件
 */
export function FilterLayout<T extends FieldValues>({
  config,
  control,
  handleSubmit,
  onSearch,
  onReset,
  loading = false
}: FilterLayoutProps<T>) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const primaryFilters = config.filter((c) => !c.advanced);
  const advancedFilters = config.filter((c) => c.advanced);
  const showToggle = advancedFilters.length > 0;

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      className='bg-card rounded-lg border p-4 shadow-sm'
    >
      <div className='flex flex-col gap-4 md:flex-row'>
        {/* 主筛选区域：flex 布局 */}
        <div className='flex flex-1 flex-wrap items-start gap-4'>
          {primaryFilters.map((c) => (
            <FilterField
              key={getFieldKey(c)}
              config={c}
              control={control}
              loading={loading}
            />
          ))}
        </div>

        {/* 操作按钮区 */}
        <div className='flex shrink-0 items-end gap-2'>
          <Button type='submit' disabled={loading} size='sm' className='h-9'>
            <Search className='mr-2 h-4 w-4' />
            查询
          </Button>
          <Button
            type='button'
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
              type='button'
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

      {/* 高级筛选区域 */}
      {isExpanded && showToggle && (
        <div className='mt-4 border-t pt-4'>
          <div className='flex flex-wrap gap-4'>
            {advancedFilters.map((c) => (
              <FilterField
                key={getFieldKey(c)}
                config={c}
                control={control}
                loading={loading}
              />
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
