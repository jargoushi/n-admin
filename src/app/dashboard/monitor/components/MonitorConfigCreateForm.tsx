/**
 * 监控配置创建表单组件
 *
 * @description
 * 使用 BaseFormLayout 提供统一布局,组件内部管理表单/结果切换逻辑
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
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
import type { MonitorConfigCreateRequest } from '../types';
import { CHANNEL_TYPES } from '../constants';
import { BaseFormLayout } from '@/components/shared/base-form-layout';
import { MonitorApiService } from '@/service/api/monitor.api';
import { useFormSubmit } from '@/hooks/useFormSubmit';

export function MonitorConfigCreateForm() {
  // 使用通用 Hook 管理提交状态
  const { result, isLoading, handleSubmit } = useFormSubmit(
    MonitorApiService.create
  );

  // 表单数据
  const [formData, setFormData] = useState<MonitorConfigCreateRequest>({
    channel_code: 1,
    target_url: ''
  });

  /**
   * 更新单个字段
   */
  const updateField = useCallback(
    (key: keyof MonitorConfigCreateRequest, value: number | string) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  /**
   * 表单校验
   */
  const isValid = useMemo(() => {
    return (
      formData.channel_code !== undefined &&
      formData.target_url.trim().length > 0 &&
      formData.target_url.length <= 512
    );
  }, [formData]);

  // 结果内容
  const resultContent = result && (
    <div className='space-y-4'>
      <div className='text-sm text-green-600'>创建监控配置成功！</div>
      <div className='bg-muted space-y-2 rounded-md p-4'>
        <div className='text-sm'>
          <span className='text-muted-foreground'>渠道：</span>
          <span className='font-medium'>{result.channel_name}</span>
        </div>
        <div className='text-sm'>
          <span className='text-muted-foreground'>目标链接：</span>
          <span className='font-medium break-all'>{result.target_url}</span>
        </div>
        {result.account_name && (
          <div className='text-sm'>
            <span className='text-muted-foreground'>账号名称：</span>
            <span className='font-medium'>{result.account_name}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <BaseFormLayout
      resultContent={resultContent}
      submit={{
        text: '立即创建',
        onSubmit: () => handleSubmit(formData),
        disabled: !isValid,
        loading: isLoading
      }}
    >
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='channel_code'>渠道类型</Label>
          <Select
            value={String(formData.channel_code)}
            onValueChange={(value) =>
              updateField('channel_code', Number(value))
            }
            disabled={isLoading}
          >
            <SelectTrigger id='channel_code'>
              <SelectValue placeholder='请选择渠道类型' />
            </SelectTrigger>
            <SelectContent>
              {CHANNEL_TYPES.map((option) => (
                <SelectItem key={option.code} value={String(option.code)}>
                  {option.desc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='target_url'>监控目标链接</Label>
          <Input
            id='target_url'
            type='text'
            value={formData.target_url}
            onChange={(e) => updateField('target_url', e.target.value)}
            placeholder='请输入监控目标链接'
            disabled={isLoading}
          />
          <p className='text-muted-foreground text-xs'>
            请输入完整的目标链接地址（最多512个字符）
          </p>
        </div>
      </div>
    </BaseFormLayout>
  );
}
