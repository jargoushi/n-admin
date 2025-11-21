'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp, Search, RotateCcw, X } from 'lucide-react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  UseFormHandleSubmit
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
import {
  DateRangePicker,
  DateRange // 导入 DateRange 类型 (假设它包含 from?: Date, to?: Date)
} from '@/components/ui/date-range-picker';

// ==================== 字段配置类型 (保持不变) ====================

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
  type: 'input';
  /** 字段键名 */
  key: Path<T>;
}

/** 下拉选择配置 */
export interface SelectConfig<T extends FieldValues> extends BaseFieldConfig {
  type: 'select';
  /** 字段键名 */
  key: Path<T>;
  /** 选项列表 */
  options: readonly { label: string; value: string | number }[];
}

/** 日期范围配置 */
export interface DateRangeConfig<T extends FieldValues>
  extends BaseFieldConfig {
  type: 'date-range';
  /** 开始日期键名 */
  startKey: Path<T>;
  /** 结束日期键名 */
  endKey: Path<T>;
}

export type FilterFieldConfig<T extends FieldValues> =
  | InputConfig<T>
  | SelectConfig<T>
  | DateRangeConfig<T>;

// ==================== 组件属性类型 (保持不变) ====================

interface FilterLayoutProps<T extends FieldValues> {
  config: FilterFieldConfig<T>[];
  control: Control<T>;
  handleSubmit: UseFormHandleSubmit<T>;
  onSearch: (data: T) => void;
  onReset: () => void;
  loading?: boolean;
}

// ==================== 内部组件 ====================

/**
 * 辅助组件: 清除按钮 (用于 Input 和 Select)
 */
function ClearButton({
  onClick,
  isHidden,
  isForSelect = false
}: {
  onClick: () => void;
  isHidden: boolean;
  isForSelect?: boolean;
}) {
  if (isHidden) return null;

  const baseClasses =
    'absolute top-1/2 -translate-y-1/2 rounded-sm opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100 z-10';

  // Select 组件特殊定位：右侧 28px，避免遮挡下拉箭头
  const positionClass = isForSelect ? 'right-[28px]' : 'right-2';

  return (
    <button
      type='button'
      onClick={onClick}
      className={`${baseClasses} ${positionClass}`}
      title='清除'
    >
      <X className='text-muted-foreground hover:text-foreground h-4 w-4' />
    </button>
  );
}

/**
 * 1. 输入框类型
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
              className='h-9 pr-8'
              // 清空输入时设为 undefined
              onChange={(e) => field.onChange(e.target.value || undefined)}
            />
            <ClearButton
              onClick={() => field.onChange(undefined)}
              isHidden={!hasValue || Boolean(loading)}
            />
          </div>
        );
      }}
    />
  );
}

/**
 * 2. 下拉选择类型
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
              {/* SelectTrigger 使用 pr-10 为 ClearButton 留出空间 */}
              <SelectTrigger id={fieldId} className='h-9 pr-10'>
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
              isHidden={!hasValue || Boolean(loading)}
              isForSelect={true} // 启用 Select 特殊定位
            />
          </div>
        );
      }}
    />
  );
}

/**
 * 3. 日期范围类型
 * 核心逻辑：将 hook-form 的 startKey/endKey 映射到 DateRangePicker 的 value/onChange。
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

  return (
    <Controller
      name={startKey}
      control={control}
      render={({ field: startField }) => (
        <Controller
          name={endKey}
          control={control}
          render={({ field: endField }) => {
            // 构造 DateRangeValue 供 DateRangePicker 使用 (将 ISO 字符串转回 Date 对象)
            const value: DateRange | undefined =
              startField.value && endField.value
                ? {
                    from: new Date(startField.value as string),
                    to: new Date(endField.value as string)
                  }
                : undefined;

            /**
             * 处理 DateRangePicker 返回的 DateRange | undefined
             * @param range DateRangePicker 返回的范围，清空时为 undefined
             */
            const handleChange = (range: DateRange | undefined) => {
              if (range?.from && range?.to) {
                // 有效范围：将 Date 对象转换成 ISO 字符串存入 RHF 字段
                startField.onChange(range.from.toISOString());
                endField.onChange(range.to.toISOString());
              } else {
                // 清空操作 (由 DateRangePicker 内部的 X 按钮触发)：将两个字段都设为 undefined
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

// ==================== 筛选字段渲染组件 (Dispatcher) ====================

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
  const spanClass =
    config.type === 'date-range'
      ? 'col-span-full sm:col-span-6 md:col-span-4'
      : 'col-span-full sm:col-span-6 md:col-span-3';

  const renderField = () => {
    switch (config.type) {
      case 'input':
        return (
          <FilterInput config={config} control={control} loading={loading} />
        );
      case 'select':
        return (
          <FilterSelect config={config} control={control} loading={loading} />
        );
      case 'date-range':
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

  const fieldId =
    config.type === 'date-range' ? String(config.startKey) : String(config.key);

  return (
    <div className={`${spanClass} space-y-2`}>
      <Label htmlFor={fieldId}>{config.label}</Label>
      {renderField()}
    </div>
  );
}

// ==================== 主组件 (保持不变) ====================

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

  const renderFields = (fieldConfigs: FilterFieldConfig<T>[]) =>
    fieldConfigs.map((c) => {
      const key = c.type === 'date-range' ? String(c.startKey) : String(c.key);
      return (
        <FilterField key={key} config={c} control={control} loading={loading} />
      );
    });

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      className='bg-card rounded-lg border p-4 shadow-sm'
    >
      <div className='flex flex-col gap-4 md:flex-row md:items-end'>
        {/* 主筛选区域：12 列网格 */}
        <div className='grid flex-1 grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 md:grid-cols-12'>
          {renderFields(primaryFilters)}
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
          <div className='grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 md:grid-cols-12'>
            {renderFields(advancedFilters)}
          </div>
        </div>
      )}
    </form>
  );
}
