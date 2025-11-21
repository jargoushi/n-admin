/**
 * 激活码派发表单组件
 *
 * @description
 * 使用 BaseFormLayout 封装通用逻辑
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { Copy } from 'lucide-react';
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
import type { ActivationCodeGetRequest } from '../types';
import {
  ACTIVATION_CODE_TYPE_OPTIONS,
  DISTRIBUTE_COUNT_RANGE,
  MESSAGES
} from '../constants';
import { BaseFormLayout } from '@/components/shared/base-form-layout';

/**
 * 表单组件属性
 */
interface ActivationCodeDistributeFormProps {
  /** 提交回调 */
  onSubmit: (data: ActivationCodeGetRequest) => Promise<string[] | null>;
  /** 取消回调（关闭对话框） */
  onCancel: () => void;
}

/**
 * 激活码派发表单组件
 *
 * @param props - 组件属性
 * @returns 表单组件
 */
export function ActivationCodeDistributeForm({
  onSubmit,
  onCancel
}: ActivationCodeDistributeFormProps) {
  // 表单数据
  const [formData, setFormData] = useState<ActivationCodeGetRequest>({
    type: 0,
    count: 1
  });

  // 派发结果
  const [result, setResult] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 更新单个字段
   */
  const updateField = useCallback(
    (key: keyof ActivationCodeGetRequest, value: number) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  /**
   * 表单校验
   */
  const isValid = useMemo(() => {
    return (
      formData.type !== undefined &&
      formData.type !== null &&
      formData.count !== undefined &&
      formData.count >= DISTRIBUTE_COUNT_RANGE.MIN &&
      formData.count <= DISTRIBUTE_COUNT_RANGE.MAX
    );
  }, [formData]);

  /**
   * 提交处理
   */
  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      const distributedCodes = await onSubmit(formData);
      if (distributedCodes) {
        setResult(distributedCodes);
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, onSubmit]);

  /**
   * 结果展示区
   */
  const resultContent = result && (
    <div className='space-y-4'>
      <div className='text-sm text-green-600'>
        {MESSAGES.SUCCESS.DISTRIBUTE}，共派发 {result.length} 个激活码。
      </div>
      <Card className='p-4'>
        <div className='flex justify-between border-b pb-2'>
          <h4 className='font-semibold'>派发激活码列表</h4>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => {
              copyToClipboard(result.join('\n'));
            }}
          >
            <Copy className='mr-2 h-4 w-4' />
            全部复制
          </Button>
        </div>
        <div className='mt-2 max-h-48 space-y-1 overflow-y-auto text-sm'>
          {result.map((code) => (
            <code key={code} className='text-muted-foreground block font-mono'>
              {code}
            </code>
          ))}
        </div>
      </Card>
    </div>
  );

  // 表单输入页面
  const formContent = (
    <div className='space-y-4'>
      {/* 激活码类型 */}
      <div className='space-y-2'>
        <Label htmlFor='type'>激活码类型</Label>
        <Select
          value={String(formData.type)}
          onValueChange={(value) => updateField('type', Number(value))}
          disabled={isLoading}
        >
          <SelectTrigger id='type'>
            <SelectValue placeholder='请选择激活码类型' />
          </SelectTrigger>
          <SelectContent>
            {/* 过滤掉“全部”选项 */}
            {ACTIVATION_CODE_TYPE_OPTIONS.filter(
              (opt) => opt.value !== 'all'
            ).map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 派发数量 */}
      <div className='space-y-2'>
        <Label htmlFor='count'>派发数量</Label>
        <Input
          id='count'
          type='number'
          min={DISTRIBUTE_COUNT_RANGE.MIN}
          max={DISTRIBUTE_COUNT_RANGE.MAX}
          value={formData.count}
          onChange={(e) => updateField('count', Number(e.target.value))}
          placeholder='请输入派发数量'
          disabled={isLoading}
        />
        <p className='text-muted-foreground text-xs'>
          可派发 {DISTRIBUTE_COUNT_RANGE.MIN}-{DISTRIBUTE_COUNT_RANGE.MAX}{' '}
          个激活码
        </p>
      </div>
    </div>
  );

  return (
    <BaseFormLayout
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isValid={isValid}
      submitText='开始派发'
      isLoading={isLoading}
      resultContent={resultContent}
    >
      {formContent}
    </BaseFormLayout>
  );
}
