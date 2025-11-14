/**
 * 激活码派发表单组件
 *
 * @description
 * 根据类型派发指定数量的激活码
 */

'use client';

import { useState } from 'react';
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
import type { ActivationCodeDistributeFormData } from '../types';
import {
  ACTIVATION_CODE_TYPE_OPTIONS,
  DISTRIBUTE_COUNT_RANGE,
  MESSAGES
} from '../constants';

/**
 * 表单组件属性
 */
interface ActivationCodeDistributeFormProps {
  /** 提交回调 */
  onSubmit: (
    data: ActivationCodeDistributeFormData
  ) => Promise<string[] | null>;
  /** 取消回调 */
  onCancel?: () => void;
  /** 提交中状态 */
  submitting?: boolean;
}

/**
 * 激活码派发表单组件
 *
 * @param props - 组件属性
 * @returns 表单组件
 */
export function ActivationCodeDistributeForm({
  onSubmit,
  onCancel,
  submitting = false
}: ActivationCodeDistributeFormProps) {
  // 表单数据
  const [formData, setFormData] = useState<ActivationCodeDistributeFormData>({
    type: 0,
    count: 1
  });

  // 派发结果
  const [result, setResult] = useState<string[] | null>(null);

  /**
   * 更新表单字段
   */
  const updateField = (
    field: keyof ActivationCodeDistributeFormData,
    value: number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * 验证表单
   */
  const validateForm = (): boolean => {
    if (
      formData.count < DISTRIBUTE_COUNT_RANGE.MIN ||
      formData.count > DISTRIBUTE_COUNT_RANGE.MAX
    ) {
      toast.error(
        `派发数量必须在 ${DISTRIBUTE_COUNT_RANGE.MIN}-${DISTRIBUTE_COUNT_RANGE.MAX} 之间`
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

    const codes = await onSubmit(formData);
    if (codes) {
      setResult(codes);
    }
  };

  /**
   * 复制所有激活码
   */
  const handleCopyAll = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.join('\n'));
      toast.success(MESSAGES.SUCCESS.COPY);
    } catch (error) {
      console.error('[handleCopyAll] Error:', error);
      toast.error(MESSAGES.ERROR.COPY);
    }
  };

  // 如果有结果，显示结果页面
  if (result) {
    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>派发结果</h3>
          <Button size='sm' onClick={handleCopyAll}>
            <Copy className='mr-2 h-4 w-4' />
            复制全部
          </Button>
        </div>

        <div className='text-muted-foreground text-sm'>
          成功派发 {result.length} 个激活码
        </div>

        <Card className='p-4'>
          <div className='max-h-80 space-y-1 overflow-y-auto'>
            {result.map((code, index) => (
              <div
                key={index}
                className='flex items-center justify-between gap-2'
              >
                <code className='flex-1 font-mono text-xs'>{code}</code>
                <Button
                  size='sm'
                  variant='ghost'
                  className='h-6 w-6 p-0'
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(code);
                      toast.success(MESSAGES.SUCCESS.COPY);
                    } catch {
                      toast.error(MESSAGES.ERROR.COPY);
                    }
                  }}
                >
                  <Copy className='h-3 w-3' />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <div className='flex justify-end'>
          <Button onClick={onCancel}>关闭</Button>
        </div>
      </div>
    );
  }

  // 表单输入页面
  return (
    <div className='space-y-4'>
      {/* 激活码类型 */}
      <div className='space-y-2'>
        <Label htmlFor='type'>激活码类型</Label>
        <Select
          value={String(formData.type)}
          onValueChange={(value) => updateField('type', Number(value))}
        >
          <SelectTrigger id='type'>
            <SelectValue placeholder={MESSAGES.PLACEHOLDER.SELECT_TYPE} />
          </SelectTrigger>
          <SelectContent>
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
        />
        <p className='text-muted-foreground text-xs'>
          可派发 {DISTRIBUTE_COUNT_RANGE.MIN}-{DISTRIBUTE_COUNT_RANGE.MAX}{' '}
          个激活码
        </p>
      </div>

      {/* 操作按钮 */}
      <div className='flex justify-end gap-2'>
        <Button variant='outline' onClick={onCancel} disabled={submitting}>
          取消
        </Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? '派发中...' : '确认派发'}
        </Button>
      </div>
    </div>
  );
}
