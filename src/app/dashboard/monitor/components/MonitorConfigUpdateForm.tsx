/**
 * 监控配置修改表单组件
 *
 * @description
 * 使用 BaseFormLayout 提供统一布局,组件内部管理表单/结果切换逻辑
 */

'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MonitorConfig, MonitorConfigUpdateRequest } from '../types';
import { BaseFormLayout } from '@/components/shared/base-form-layout';
import { MonitorApiService } from '@/service/api/monitor.api';
import { useFormSubmit } from '@/hooks/useFormSubmit';

interface MonitorConfigUpdateFormProps {
  /** 要修改的监控配置 */
  config: MonitorConfig;
}

export function MonitorConfigUpdateForm({
  config
}: MonitorConfigUpdateFormProps) {
  // 使用通用 Hook 管理提交状态
  const { result, isLoading, handleSubmit } = useFormSubmit(
    (data: MonitorConfigUpdateRequest) =>
      MonitorApiService.update(config.id, data)
  );

  // 表单数据
  const [formData, setFormData] = useState<MonitorConfigUpdateRequest>({
    target_url: config.target_url
  });

  // 同步外部数据变化
  useEffect(() => {
    setFormData({ target_url: config.target_url });
  }, [config.target_url]);

  /**
   * 更新字段
   */
  const updateField = useCallback((value: string) => {
    setFormData({ target_url: value });
  }, []);

  /**
   * 表单校验
   */
  const isValid = useMemo(() => {
    return (
      formData.target_url.trim().length > 0 &&
      formData.target_url.length <= 512 &&
      formData.target_url !== config.target_url
    );
  }, [formData.target_url, config.target_url]);

  // 结果内容
  const resultContent = result && (
    <div className='space-y-4'>
      <div className='text-sm text-green-600'>修改监控配置成功！</div>
      <div className='bg-muted space-y-2 rounded-md p-4'>
        <div className='text-sm'>
          <span className='text-muted-foreground'>新的目标链接：</span>
          <span className='font-medium break-all'>{result.target_url}</span>
        </div>
      </div>
    </div>
  );

  return (
    <BaseFormLayout
      resultContent={resultContent}
      submit={{
        text: '保存修改',
        onSubmit: () => handleSubmit(formData),
        disabled: !isValid,
        loading: isLoading
      }}
    >
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label>当前渠道</Label>
          <div className='text-muted-foreground text-sm'>
            {config.channel_name}
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='target_url'>监控目标链接</Label>
          <Input
            id='target_url'
            type='text'
            value={formData.target_url}
            onChange={(e) => updateField(e.target.value)}
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
