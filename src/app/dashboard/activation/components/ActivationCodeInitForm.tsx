/**
 * 激活码批量初始化表单组件
 *
 * @description
 * 支持批量生成多种类型的激活码
 * - 动态添加/移除初始化项
 * - 每种类型只能出现一次（自动禁用已选择类型）
 * - 最多4个初始化项（对应4种激活码类型）
 * - 最少保留1个初始化项
 */

'use client';

import { useState } from 'react';
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
import type {
  ActivationCodeBatchInitItem,
  ActivationCodeInitFormData,
  ActivationCodeBatchResponse
} from '../types';
import {
  ACTIVATION_CODE_TYPE_OPTIONS,
  MAX_INIT_ITEMS,
  INIT_COUNT_RANGE,
  MESSAGES,
  CODE_TYPE_CONFIG
} from '../constants';

/**
 * 表单组件属性
 */
interface ActivationCodeInitFormProps {
  /** 提交回调 */
  onSubmit: (
    data: ActivationCodeInitFormData
  ) => Promise<ActivationCodeBatchResponse | null>;
}

/**
 * 激活码批量初始化表单组件
 *
 * @param props - 组件属性
 * @returns 表单组件
 */
export function ActivationCodeInitForm({
  onSubmit
}: ActivationCodeInitFormProps) {
  // 初始化项列表
  const [items, setItems] = useState<ActivationCodeBatchInitItem[]>([
    { type: 0, count: 10 }
  ]);

  // 批量初始化结果
  const [result, setResult] = useState<ActivationCodeBatchResponse | null>(
    null
  );

  /**
   * 添加初始化项
   * 自动选择一个未使用的类型
   */
  const handleAddItem = () => {
    const usedCodes = new Set(items.map((item) => item.type));

    const nextTypeCode = Object.keys(CODE_TYPE_CONFIG)
      .map((key) => Number(key))
      .find((code) => !usedCodes.has(code));

    if (!nextTypeCode) {
      toast.error('所有激活码类型已添加');
      return;
    }

    setItems((prev) => [...prev, { type: nextTypeCode, count: 10 }]);
  };

  /**
   * 移除初始化项
   */
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  /**
   * 更新初始化项
   */
  const handleUpdateItem = (
    index: number,
    field: keyof ActivationCodeBatchInitItem,
    value: number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  /**
   * 验证表单
   */
  const validateForm = (): boolean => {
    // 检查是否有空项
    const hasEmptyItem = items.some((item) => !item.type && item.type !== 0);
    if (hasEmptyItem) {
      toast.error(MESSAGES.ERROR.INVALID_FORM);
      return false;
    }

    // 检查类型是否重复
    const types = items.map((item) => item.type);
    const uniqueTypes = new Set(types);
    if (types.length !== uniqueTypes.size) {
      toast.error(MESSAGES.ERROR.DUPLICATE_TYPE);
      return false;
    }

    // 检查数量范围
    const invalidCount = items.some(
      (item) =>
        item.count < INIT_COUNT_RANGE.MIN || item.count > INIT_COUNT_RANGE.MAX
    );
    if (invalidCount) {
      toast.error(
        `生成数量必须在 ${INIT_COUNT_RANGE.MIN}-${INIT_COUNT_RANGE.MAX} 之间`
      );
      return false;
    }

    return true;
  };

  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const response = await onSubmit({ items });
    if (response) {
      setResult(response);
    }
  };

  /**
   * 复制所有激活码
   */
  const handleCopyAllCodes = async () => {
    if (!result) return;

    const allCodes = result.results
      .map(
        (r) =>
          `# ${r.type_name} (${r.count}个)\n${r.activation_codes.join('\n')}`
      )
      .join('\n\n');

    await navigator.clipboard.writeText(allCodes);
    toast.success(MESSAGES.SUCCESS.COPY);
  };

  // 如果有结果，显示结果页面
  if (result) {
    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>生成结果</h3>
          <Button size='sm' onClick={handleCopyAllCodes}>
            <Copy className='mr-2 h-4 w-4' />
            复制全部
          </Button>
        </div>

        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>总数量:</span>
            <span className='font-semibold'>{result.total_count} 个</span>
          </div>
        </div>

        <div className='space-y-3'>
          {result.results.map((typeResult) => (
            <Card key={typeResult.type} className='p-4'>
              <div className='mb-2 flex items-center justify-between'>
                <h4 className='font-medium'>
                  {typeResult.type_name} ({typeResult.count}个)
                </h4>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      typeResult.activation_codes.join('\n')
                    );
                    toast.success(MESSAGES.SUCCESS.COPY);
                  }}
                >
                  <Copy className='mr-2 h-3 w-3' />
                  复制
                </Button>
              </div>
              <div className='max-h-40 space-y-1 overflow-y-auto'>
                {typeResult.activation_codes.map((code, index) => (
                  <div key={index} className='font-mono text-xs'>
                    {code}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 表单输入页面
  return (
    <div className='space-y-4'>
      {/* 初始化项列表 */}
      <div className='space-y-3'>
        {items.map((item, index) => (
          <Card key={index} className='p-4'>
            <div className='grid gap-4 md:grid-cols-[1fr_1fr_auto]'>
              {/* 激活码类型 */}
              <div className='space-y-2'>
                <Label>激活码类型</Label>
                <Select
                  value={String(item.type)}
                  onValueChange={(value) =>
                    handleUpdateItem(index, 'type', Number(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIVATION_CODE_TYPE_OPTIONS.filter(
                      (opt) => opt.value !== 'all'
                    ).map((option) => {
                      // 检查该类型是否已被其他项使用
                      const isUsedByOther = items.some(
                        (otherItem, otherIndex) =>
                          otherIndex !== index &&
                          otherItem.type === option.value
                      );

                      return (
                        <SelectItem
                          key={option.value}
                          value={String(option.value)}
                          disabled={isUsedByOther}
                        >
                          {option.label}
                          {isUsedByOther && ' (已使用)'}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* 生成数量 */}
              <div className='space-y-2'>
                <Label>生成数量</Label>
                <Input
                  type='number'
                  min={INIT_COUNT_RANGE.MIN}
                  max={INIT_COUNT_RANGE.MAX}
                  value={item.count}
                  onChange={(e) =>
                    handleUpdateItem(index, 'count', Number(e.target.value))
                  }
                  placeholder={MESSAGES.PLACEHOLDER.INPUT_COUNT}
                />
              </div>

              {/* 删除按钮 */}
              <div className='flex items-end'>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => handleRemoveItem(index)}
                  disabled={items.length === 1}
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
        <Button variant='outline' onClick={handleAddItem} className='w-full'>
          <Plus className='mr-2 h-4 w-4' />
          添加初始化项 ({items.length}/{MAX_INIT_ITEMS})
        </Button>
      )}

      {/* 操作按钮 */}
      <div className='flex justify-end gap-2'>
        <Button onClick={handleSubmit}>开始生成</Button>
      </div>
    </div>
  );
}
