'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

// 引入公共组件和类型
import {
  EntityDetailView,
  FieldConfig
} from '@/components/shared/EntityDetailView';
import { formatDateTime } from '@/lib/data-utils';
import type { ActivationCode } from '../types';
// 引入常量配置,使其内聚
import { ACTIVATION_CODE_TYPES, ACTIVATION_CODE_STATUSES } from '../constants';

/**
 * 激活码详情视图配置
 */
const CODE_DETAIL_CONFIG: FieldConfig<ActivationCode>[] = [
  {
    label: '激活码',
    key: 'activation_code',
    render: (value: string) => (
      <code className='font-mono text-lg font-medium break-all'>{value}</code>
    )
  },
  {
    label: '类型',
    key: 'type',
    render: (_: unknown, data: ActivationCode) => (
      <Badge variant={ACTIVATION_CODE_TYPES[data.type]?.variant || 'secondary'}>
        {data.type_name}
      </Badge>
    )
  },
  {
    label: '状态',
    key: 'status',
    render: (_: unknown, data: ActivationCode) => (
      <Badge
        variant={ACTIVATION_CODE_STATUSES[data.status]?.variant || 'secondary'}
      >
        {data.status_name}
      </Badge>
    )
  },
  {
    label: '创建时间',
    key: 'created_at',
    render: (value: string) => formatDateTime(value)
  },
  {
    label: '更新时间',
    key: 'updated_at',
    render: (value: string) => formatDateTime(value)
  },
  {
    label: '过期时间',
    key: 'expire_time',
    render: (_: unknown, data: ActivationCode) => {
      // 匹配原始逻辑:类型 3 为永久有效
      if (data.type === 3) return <span className='text-sm'>永久有效</span>;
      return (
        <span className='text-sm'>{formatDateTime(data.expire_time)}</span>
      );
    }
  },
  {
    label: '分发时间',
    key: 'distributed_at',
    render: (value: string) => formatDateTime(value)
  },
  {
    label: '激活时间',
    key: 'activated_at',
    render: (value: string) => formatDateTime(value)
  }
];

interface ActivationCodeDetailViewProps {
  /** 详情数据 */
  data: ActivationCode | null;
}

/**
 * 激活码详情视图组件
 */
export function ActivationCodeDetailView({
  data
}: ActivationCodeDetailViewProps) {
  if (!data) {
    return null;
  }

  return <EntityDetailView data={data} config={CODE_DETAIL_CONFIG} />;
}
