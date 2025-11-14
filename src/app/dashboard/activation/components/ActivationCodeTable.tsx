/**
 * 激活码数据表格组件
 *
 * @description
 * 显示激活码列表，支持复制、激活、作废、查看详情等操作
 */

'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { Copy, Check, X, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/table/data-table';
import {
  ActionDropdown,
  type ActionItem
} from '@/components/table/action-dropdown';
import { toast } from 'sonner';
import type { ActivationCode, PaginationInfo, TableColumn } from '../types';
import {
  TABLE_COLUMNS,
  TYPE_BADGE_MAP,
  STATUS_BADGE_MAP,
  DATE_TIME_FORMAT,
  MESSAGES
} from '../constants';

/**
 * 表格组件属性
 */
interface ActivationCodeTableProps {
  /** 激活码列表数据 */
  data: ActivationCode[];
  /** 加载状态 */
  loading?: boolean;
  /** 分页信息 */
  pagination: PaginationInfo;
  /** 激活激活码 */
  onActivate?: (code: ActivationCode) => void;
  /** 作废激活码 */
  onInvalidate?: (code: ActivationCode) => void;
  /** 查看详情 */
  onViewDetail?: (code: ActivationCode) => void;
}

/**
 * 激活码数据表格组件
 *
 * @description
 * 基于配置驱动的表格组件，支持：
 * - 动态列渲染
 * - Badge 显示类型和状态
 * - 复制激活码功能
 * - 根据状态显示不同操作按钮
 *
 * @param props - 组件属性
 * @returns 表格组件
 */
export function ActivationCodeTable({
  data,
  loading = false,
  pagination,
  onActivate,
  onInvalidate,
  onViewDetail
}: ActivationCodeTableProps) {
  /**
   * 复制激活码到剪贴板
   */
  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(MESSAGES.SUCCESS.COPY);
    } catch (error) {
      console.error('[handleCopyCode] Error:', error);
      toast.error(MESSAGES.ERROR.COPY);
    }
  };

  /**
   * 格式化日期时间
   */
  const formatDateTime = (dateString: string | undefined): string => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), DATE_TIME_FORMAT);
    } catch {
      return dateString;
    }
  };

  /**
   * 动态列配置（基于 TABLE_COLUMNS）
   */
  const columns = useMemo(() => {
    return TABLE_COLUMNS.map((col) => {
      // 序号列
      if (col.key === 'index') {
        return {
          ...col,
          render: (_: unknown, __: ActivationCode, index: number) => {
            const globalIndex =
              (pagination.page - 1) * pagination.limit + index + 1;
            return (
              <span className='text-muted-foreground font-mono text-xs'>
                {globalIndex}
              </span>
            );
          }
        };
      }

      // 激活码列（可复制）
      if (col.key === 'activation_code') {
        return {
          ...col,
          render: (_: unknown, record: ActivationCode) => (
            <div className='flex items-center gap-2'>
              <code className='text-xs'>{record.activation_code}</code>
              <Button
                size='sm'
                variant='ghost'
                className='h-6 w-6 p-0'
                onClick={() => handleCopyCode(record.activation_code)}
              >
                <Copy className='h-3 w-3' />
              </Button>
            </div>
          )
        };
      }

      // 类型列（Badge 显示）
      if (col.key === 'type') {
        return {
          ...col,
          render: (_: unknown, record: ActivationCode) => {
            const badgeInfo =
              TYPE_BADGE_MAP[record.type as keyof typeof TYPE_BADGE_MAP];
            return (
              <Badge variant={badgeInfo?.variant || 'secondary'}>
                {record.type_name}
              </Badge>
            );
          }
        };
      }

      // 状态列（Badge 显示）
      if (col.key === 'status') {
        return {
          ...col,
          render: (_: unknown, record: ActivationCode) => {
            const badgeInfo =
              STATUS_BADGE_MAP[record.status as keyof typeof STATUS_BADGE_MAP];
            return (
              <Badge variant={badgeInfo?.variant || 'secondary'}>
                {record.status_name}
              </Badge>
            );
          }
        };
      }

      // 分发时间列
      if (col.key === 'distributed_at') {
        return {
          ...col,
          render: (_: unknown, record: ActivationCode) => (
            <span className='text-sm'>
              {formatDateTime(record.distributed_at)}
            </span>
          )
        };
      }

      // 激活时间列
      if (col.key === 'activated_at') {
        return {
          ...col,
          render: (_: unknown, record: ActivationCode) => (
            <span className='text-sm'>
              {formatDateTime(record.activated_at)}
            </span>
          )
        };
      }

      // 过期时间列
      if (col.key === 'expire_time') {
        return {
          ...col,
          render: (_: unknown, record: ActivationCode) => {
            // 永久卡显示"永久有效"
            if (record.type === 3) {
              return (
                <span className='text-muted-foreground text-sm'>永久有效</span>
              );
            }
            return (
              <span className='text-sm'>
                {formatDateTime(record.expire_time)}
              </span>
            );
          }
        };
      }

      // 创建时间列
      if (col.key === 'created_at') {
        return {
          ...col,
          render: (_: unknown, record: ActivationCode) => (
            <span className='text-sm'>{formatDateTime(record.created_at)}</span>
          )
        };
      }

      // 操作列（动态按钮）
      if (col.key === 'actions') {
        return {
          ...col,
          render: (_: unknown, record: ActivationCode) => {
            const actions: ActionItem[] = [];

            // 状态=已分发 → 显示"激活"按钮
            if (record.status === 1 && onActivate) {
              actions.push({
                key: 'activate',
                label: '激活',
                icon: <Check className='mr-2 h-4 w-4' />,
                onClick: () => onActivate(record)
              });
            }

            // 状态=已分发或已激活 → 显示"作废"按钮
            if ((record.status === 1 || record.status === 2) && onInvalidate) {
              actions.push({
                key: 'invalidate',
                label: '作废',
                icon: <X className='mr-2 h-4 w-4' />,
                onClick: () => onInvalidate(record)
              });
            }

            // 所有状态 → 显示"详情"按钮
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
        };
      }

      return col;
    });
  }, [pagination, onActivate, onInvalidate, onViewDetail]);

  return (
    <DataTable
      columns={columns as TableColumn[]}
      data={data}
      loading={loading}
      rowKey='id'
    />
  );
}
