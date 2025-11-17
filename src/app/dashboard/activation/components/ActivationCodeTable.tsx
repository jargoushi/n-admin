/**
 * 激活码数据表格组件
 *
 * @description
 * 显示激活码列表，支持复制、激活、作废、查看详情等操作
 */

'use client';

import { useMemo } from 'react';
import { Check, X, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/table/data-table';
import {
  ActionDropdown,
  type ActionItem
} from '@/components/table/action-dropdown';
import type { ActivationCode, TableColumn } from '../types';
import { CODE_TYPE_CONFIG, STATUS_BADGE_MAP } from '../constants';

/**
 * 表格组件属性
 */
interface ActivationCodeTableProps {
  data: ActivationCode[];
  loading?: boolean;
  onActivate?: (code: ActivationCode) => void;
  onInvalidate?: (code: ActivationCode) => void;
  onViewDetail?: (code: ActivationCode) => void;
}

export function ActivationCodeTable({
  data,
  loading = false,
  onActivate,
  onInvalidate,
  onViewDetail
}: ActivationCodeTableProps) {
  /** 合并列配置与渲染逻辑 */
  const columns = useMemo<TableColumn[]>(
    () => [
      {
        key: 'activation_code',
        title: '激活码',
        className: 'min-w-[280px] font-mono font-medium'
      },
      {
        key: 'type',
        title: '类型',
        className: 'w-[100px] text-center',
        render: (_: unknown, record: ActivationCode) => {
          const badgeInfo =
            CODE_TYPE_CONFIG[record.type as keyof typeof CODE_TYPE_CONFIG];
          return (
            <Badge variant={badgeInfo?.variant || 'secondary'}>
              {record.type_name}
            </Badge>
          );
        }
      },
      {
        key: 'status',
        title: '状态',
        className: 'w-[100px] text-center',
        render: (_: unknown, record: ActivationCode) => {
          const badgeInfo =
            STATUS_BADGE_MAP[record.status as keyof typeof STATUS_BADGE_MAP];
          return (
            <Badge variant={badgeInfo?.variant || 'secondary'}>
              {record.status_name}
            </Badge>
          );
        }
      },
      {
        key: 'distributed_at',
        title: '分发时间',
        className: 'w-[180px]'
      },
      {
        key: 'activated_at',
        title: '激活时间',
        className: 'w-[180px]'
      },
      {
        key: 'expire_time',
        title: '过期时间',
        className: 'w-[180px]',
        render: (_: unknown, record: ActivationCode) => {
          if (record.type === 3) {
            return (
              <span className='text-muted-foreground text-sm'>永久有效</span>
            );
          }
          return <span className='text-sm'>{record.expire_time}</span>;
        }
      },
      {
        key: 'created_at',
        title: '创建时间',
        className: 'w-[180px]'
      },
      {
        key: 'actions',
        title: '操作',
        className: 'w-[120px] text-center',
        render: (_: unknown, record: ActivationCode) => {
          const actions: ActionItem[] = [];

          if (record.status === 1 && onActivate) {
            actions.push({
              key: 'activate',
              label: '激活',
              icon: <Check className='mr-2 h-4 w-4' />,
              onClick: () => onActivate(record)
            });
          }

          if ((record.status === 1 || record.status === 2) && onInvalidate) {
            actions.push({
              key: 'invalidate',
              label: '作废',
              icon: <X className='mr-2 h-4 w-4' />,
              onClick: () => onInvalidate(record)
            });
          }

          if (onViewDetail) {
            actions.push({
              key: 'detail',
              label: '详情',
              icon: <Eye className='mr-2 h-4 w-4' />,
              onClick: () => onViewDetail(record)
            });
          }

          return <ActionDropdown actions={actions} />;
        }
      }
    ],
    [onActivate, onInvalidate, onViewDetail]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey='activation_code'
    />
  );
}
