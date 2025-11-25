/**
 * 激活码派发表单组件
 *
 * @description
 * 使用 BaseFormLayout 提供统一布局,组件内部管理表单/结果切换逻辑
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
import { copyToClipboard } from '@/lib/utils';
import type { ActivationCodeGetRequest } from '../types';
import { ACTIVATION_CODE_TYPES, DISTRIBUTE_COUNT_RANGE } from '../constants';
import { BaseFormLayout } from '@/components/shared/base-form-layout';
import { ActivationApiService } from '@/service/api/activation.api';
import { useFormSubmit } from '@/hooks/useFormSubmit';

export function ActivationCodeDistributeForm() {
  // 使用通用 Hook 管理提交状态
  const { result, isLoading, handleSubmit } = useFormSubmit(
    ActivationApiService.distribute
  );

  // 表单数据
  const [formData, setFormData] = useState<ActivationCodeGetRequest>({
    type: 0,
    count: 1
  });

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

  // 结果内容
  const resultContent = result && (
    <div className='space-y-4'>
      <div className='text-sm text-green-600'>
        派发激活码成功,共派发 {result.length} 个激活码。
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

  return (
    <BaseFormLayout
      resultContent={resultContent}
      submit={{
        text: '立即派发',
        onSubmit: () => handleSubmit(formData),
        disabled: !isValid,
        loading: isLoading
      }}
    >
      <div className='space-y-4'>
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
              {ACTIVATION_CODE_TYPES.map((option) => (
                <SelectItem key={option.code} value={String(option.code)}>
                  {option.desc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
    </BaseFormLayout>
  );
}
