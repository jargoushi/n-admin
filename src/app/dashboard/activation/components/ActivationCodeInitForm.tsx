/**
 * 激活码批量初始化表单组件
 *
 * @description
 * 使用 BaseFormLayout 封装通用逻辑，专注于处理动态列表和业务校验。
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
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
  CODE_TYPE_CONFIG
} from '../constants';
import { BaseFormLayout } from '@/components/shared/base-form-layout';

/**
 * 默认初始化项
 */
const DEFAULT_ITEM: ActivationCodeCreateItem = {
  type: 0, // 默认为日卡
  count: INIT_COUNT_RANGE.MIN
};

/**
 * 表单组件属性
 */
interface ActivationCodeInitFormProps {
  /** 提交回调 */
  onSubmit: (
    data: ActivationCodeBatchCreateRequest
  ) => Promise<ActivationCodeBatchResponse | null>;
  /** 取消回调（关闭对话框） */
  onCancel: () => void;
}

/**
 * 激活码批量初始化表单组件
 *
 * @param props - 组件属性
 * @returns 表单组件
 */
export function ActivationCodeInitForm({
  onSubmit,
  onCancel
}: ActivationCodeInitFormProps) {
  // 表单数据：初始化项列表
  const [items, setItems] = useState<ActivationCodeCreateItem[]>([
    DEFAULT_ITEM
  ]);

  // 提交结果
  const [result, setResult] = useState<ActivationCodeBatchResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

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

    // 尝试找到一个未被使用的类型作为新项的默认值
    const nextType = ACTIVATION_CODE_TYPE_OPTIONS.find(
      (opt) => !selectedTypes.has(opt.value as number)
    )?.value as number | undefined;

    // 如果找不到未使用的类型，则默认使用第一个未使用的类型，如果所有类型都用完了，则默认给 0
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
            // 如果修改的是类型，需要进行重复校验
            if (
              key === 'type' &&
              selectedTypes.has(value) &&
              value !== item.type
            ) {
              return item; // 阻止更新
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
   * 1. 至少一个项
   * 2. 所有项的 type 不重复
   * 3. 所有项的 count 在有效范围内
   */
  const isValid = useMemo(() => {
    if (items.length === 0) return false;

    // 检查重复类型 (已在 handleUpdateItem 中处理，但此处做最终校验)
    if (selectedTypes.size !== items.length) {
      // 理论上不会发生，除非在 handleUpdateItem 校验前修改了 items
      return false;
    }

    // 检查数量范围
    return items.every(
      (item) =>
        item.count >= INIT_COUNT_RANGE.MIN && item.count <= INIT_COUNT_RANGE.MAX
    );
  }, [items, selectedTypes.size]);

  /**
   * 提交处理
   */
  const handleSubmit = useCallback(async () => {
    if (!isValid) {
      toast.error('请填写完整的表单信息');
      return;
    }

    setIsLoading(true);
    try {
      const data: ActivationCodeBatchCreateRequest = { items };
      const response = await onSubmit(data);
      if (response) {
        setResult(response);
      }
    } finally {
      setIsLoading(false);
    }
  }, [items, isValid, onSubmit]);

  /**
   * 结果展示区
   */
  const resultContent = result && (
    <div className='space-y-4'>
      <div className='text-sm text-green-600'>
        批量初始化激活码成功，共初始化 {result.total_count} 个激活码。
      </div>

      {/* 结果明细列表 */}
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

  // 表单输入页面
  const formContent = (
    <div className='space-y-4'>
      {/* 初始化项列表 */}
      <div className='max-h-[300px] space-y-4 overflow-y-auto'>
        {items.map((item, index) => (
          <Card key={index} className='p-4'>
            <div className='grid grid-cols-12 gap-4'>
              {/* 激活码类型 Select (占据 5/12) */}
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
                          // 禁用已选中的类型（排除当前项的类型）
                          disabled={
                            selectedTypes.has(typeValue) &&
                            typeValue !== item.type
                          }
                        >
                          {option.label} ({CODE_TYPE_CONFIG[typeValue].label})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* 生成数量 Input (占据 5/12) */}
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

              {/* 删除按钮 (占据 2/12) */}
              <div className='col-span-12 flex items-end justify-end sm:col-span-2'>
                <Button
                  size='icon'
                  variant='destructive' // 使用危险按钮样式
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

      {/* 添加按钮 */}
      {items.length < MAX_INIT_ITEMS && (
        <Button
          variant='outline'
          onClick={handleAddItem}
          className='w-full'
          type='button' // 确保不触发 form 提交
          disabled={isLoading || selectedTypes.size === MAX_INIT_ITEMS} // 如果所有4种类型都选完了，则禁用
        >
          <Plus className='mr-2 h-4 w-4' />
          添加初始化项 ({items.length}/{MAX_INIT_ITEMS})
        </Button>
      )}

      <p className='text-muted-foreground text-xs'>
        每种激活码类型只能初始化一次，共 {MAX_INIT_ITEMS} 种类型。
      </p>
    </div>
  );

  return (
    <BaseFormLayout
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isValid={isValid}
      submitText='开始生成'
      isLoading={isLoading}
      resultContent={resultContent}
    >
      {formContent}
    </BaseFormLayout>
  );
}
