/**
 * 激活码批量初始化表单组件
 *
 * @description
 * 使用 BaseFormLayout 提供统一布局,组件内部管理表单/结果切换逻辑
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { Plus, Trash2, Copy, Loader2 } from 'lucide-react';
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
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/utils';
import type {
  ActivationCodeCreateItem,
  ActivationCodeBatchCreateRequest,
  ActivationCodeBatchResponse,
  ActivationCodeTypeResult
} from '../types';
import {
  ACTIVATION_CODE_TYPE_OPTIONS,
  MAX_INIT_ITEMS,
  INIT_COUNT_RANGE,
  ACTIVATION_CODE_TYPES
} from '../constants';
import { BaseFormLayout } from '@/components/shared/base-form-layout';
import { ActivationApiService } from '@/service/api/activation.api';
import { useFormSubmit } from '@/hooks/useFormSubmit';

/**
 * 默认初始化项
 */
const DEFAULT_ITEM: ActivationCodeCreateItem = {
  type: 0,
  count: INIT_COUNT_RANGE.MIN
};

export function ActivationCodeInitForm() {
  // 使用通用 Hook 管理提交状态
  const { result, isLoading, handleSubmit } = useFormSubmit(
    ActivationApiService.init
  );

  // 表单数据
  const [items, setItems] = useState<ActivationCodeCreateItem[]>([
    DEFAULT_ITEM
  ]);

  /**
   * 获取当前已选中的类型列表
   */
  const selectedTypes = useMemo(
    () => new Set(items.map((item) => item.type)),
    [items]
  );

  /**
   * 处理添加初始化项
   */
  const handleAddItem = useCallback(() => {
    if (items.length >= MAX_INIT_ITEMS) return;

    const nextType = ACTIVATION_CODE_TYPE_OPTIONS.find(
      (opt) => !selectedTypes.has(opt.value as number)
    )?.value as number | undefined;

    const newType = nextType !== undefined ? nextType : DEFAULT_ITEM.type;

    setItems((prev) => [...prev, { ...DEFAULT_ITEM, type: newType }]);
  }, [items.length, selectedTypes]);

  /**
   * 处理移除初始化项
   */
  const handleRemoveItem = useCallback(
    (index: number) => {
      if (items.length === 1) return;
      setItems((prev) => prev.filter((_, i) => i !== index));
    },
    [items.length]
  );

  /**
   * 处理更新初始化项字段
   */
  const handleUpdateItem = useCallback(
    (index: number, key: keyof ActivationCodeCreateItem, value: number) => {
      setItems((prev) =>
        prev.map((item, i) => {
          if (i === index) {
            if (
              key === 'type' &&
              selectedTypes.has(value) &&
              value !== item.type
            ) {
              return item;
            }
            return { ...item, [key]: value };
          }
          return item;
        })
      );
    },
    [selectedTypes]
  );

  /**
   * 表单校验逻辑
   */
  const isValid = useMemo(() => {
    if (items.length === 0) return false;

    if (selectedTypes.size !== items.length) {
      return false;
    }

    return items.every(
      (item) =>
        item.count >= INIT_COUNT_RANGE.MIN && item.count <= INIT_COUNT_RANGE.MAX
    );
  }, [items, selectedTypes.size]);

  // 结果内容
  const resultContent = result && (
    <div className='space-y-4'>
      <div className='text-sm text-green-600'>
        批量初始化激活码成功,共初始化 {result.total_count} 个激活码。
      </div>

      {result.results.map((typeResult: ActivationCodeTypeResult) => (
        <Card key={typeResult.type} className='p-4'>
          <div className='flex justify-between border-b pb-2'>
            <h4 className='font-semibold'>
              {typeResult.type_name} ({typeResult.count} 个)
            </h4>
            <Button
              variant='ghost'
              type='button'
              size='sm'
              onClick={() => {
                copyToClipboard(typeResult.activation_codes.join('\n'));
              }}
            >
              <Copy className='mr-2 h-4 w-4' />
              复制
            </Button>
          </div>
          <div className='mt-2 max-h-24 space-y-1 overflow-y-auto text-xs'>
            {typeResult.activation_codes.map((code) => (
              <code
                key={code}
                className='text-muted-foreground block font-mono'
              >
                {code}
              </code>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <BaseFormLayout
      resultContent={resultContent}
      submit={{
        text: '立即生成',
        onSubmit: () => handleSubmit({ items }),
        disabled: !isValid,
        loading: isLoading
      }}
    >
      <div className='space-y-4'>
        <div className='max-h-[300px] space-y-4 overflow-y-auto'>
          {items.map((item, index) => (
            <Card key={index} className='p-4'>
              <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-12 space-y-2 sm:col-span-5'>
                  <Label>激活码类型</Label>
                  <Select
                    value={String(item.type)}
                    onValueChange={(value) =>
                      handleUpdateItem(index, 'type', Number(value))
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='请选择激活码类型' />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVATION_CODE_TYPE_OPTIONS.map((option) => {
                        const typeValue = option.value as 0 | 1 | 2 | 3;
                        return (
                          <SelectItem
                            key={option.value}
                            value={String(option.value)}
                            disabled={
                              selectedTypes.has(typeValue) &&
                              typeValue !== item.type
                            }
                          >
                            {option.label} (
                            {ACTIVATION_CODE_TYPES[typeValue].label})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className='col-span-12 space-y-2 sm:col-span-5'>
                  <Label>生成数量</Label>
                  <Input
                    type='number'
                    min={INIT_COUNT_RANGE.MIN}
                    max={INIT_COUNT_RANGE.MAX}
                    value={item.count}
                    onChange={(e) =>
                      handleUpdateItem(index, 'count', Number(e.target.value))
                    }
                    placeholder='请输入生成数量'
                    disabled={isLoading}
                  />
                </div>

                <div className='col-span-12 flex items-end justify-end sm:col-span-2'>
                  <Button
                    size='icon'
                    variant='destructive'
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length === 1 || isLoading}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {items.length < MAX_INIT_ITEMS && (
          <Button
            variant='outline'
            onClick={handleAddItem}
            className='w-full'
            type='button'
            disabled={isLoading || selectedTypes.size === MAX_INIT_ITEMS}
          >
            <Plus className='mr-2 h-4 w-4' />
            添加初始化项 ({items.length}/{MAX_INIT_ITEMS})
          </Button>
        )}

        <p className='text-muted-foreground text-xs'>
          每种激活码类型只能初始化一次,共 {MAX_INIT_ITEMS} 种类型。
        </p>
      </div>
    </BaseFormLayout>
  );
}
