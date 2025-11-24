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
// 引入常量配置，使其内聚
import { CODE_TYPE_CONFIG, STATUS_BADGE_MAP } from '../constants';

// ===================================================================
// 激活码详情配置
// -------------------------------------------------------------------
// 解决 TS 报错：定义一个本地类型别名，用于显式指定 key 的类型
type ActivationCodeKey = keyof ActivationCode;

/**
 * 激活码详情视图配置
 * （从 ActivationCodeDialogs.tsx 移动至此）
 */
const CODE_DETAIL_CONFIG: FieldConfig<ActivationCode>[] = [
  {
    label: '激活码',
    // 显式断言 key 的类型
    key: 'activation_code' as ActivationCodeKey,
    render: (value: string) => (
      <code className='font-mono text-lg font-medium break-all'>{value}</code>
    )
  },
  {
    label: '类型',
    // 显式断言 key 的类型
    key: 'type' as ActivationCodeKey,
    render: (_: unknown, data: ActivationCode) => (
      <Badge
        // 使用 constants.ts 中定义的映射
        variant={
          CODE_TYPE_CONFIG[data.type as keyof typeof CODE_TYPE_CONFIG]
            ?.variant || 'secondary'
        }
      >
        {data.type_name}
      </Badge>
    )
  },
  {
    label: '状态',
    // 显式断言 key 的类型
    key: 'status' as ActivationCodeKey,
    render: (_: unknown, data: ActivationCode) => (
      <Badge
        // 使用 constants.ts 中定义的映射
        variant={
          STATUS_BADGE_MAP[data.status as keyof typeof STATUS_BADGE_MAP]
            ?.variant || 'secondary'
        }
      >
        {data.status_name}
      </Badge>
    )
  },
  {
    label: '创建时间',
    key: 'created_at' as ActivationCodeKey,
    render: (value: string) => formatDateTime(value)
  },
  {
    label: '更新时间',
    key: 'updated_at' as ActivationCodeKey,
    render: (value: string) => formatDateTime(value)
  },
  {
    label: '过期时间',
    key: 'expire_time' as ActivationCodeKey,
    render: (_: unknown, data: ActivationCode) => {
      // 匹配原始逻辑：类型 3 为永久有效
      if (data.type === 3) return <span className='text-sm'>永久有效</span>;
      return (
        <span className='text-sm'>{formatDateTime(data.expire_time)}</span>
      );
    }
  },
  {
    label: '分发时间',
    key: 'distributed_at' as ActivationCodeKey,
    render: (value: string) => formatDateTime(value)
  },
  {
    label: '激活时间',
    key: 'activated_at' as ActivationCodeKey,
    render: (value: string) => formatDateTime(value)
  }
];

// ===================================================================
// ActivationCodeDetailView 组件
// ===================================================================

interface ActivationCodeDetailViewProps {
  /** 详情数据，由 GenericDialogs/父级对话框传入 */
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

  return (
    <EntityDetailView
      data={data}
      config={CODE_DETAIL_CONFIG} // 使用内聚的配置
    />
  );
}
