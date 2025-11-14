import React from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/table/page-header';

interface PermissionPageHeaderProps {
  /** 新增权限回调 */
  onCreatePermission: () => void;
}

/**
 * 权限管理页面头部组件
 */
export function PermissionPageHeader({
  onCreatePermission
}: PermissionPageHeaderProps) {
  return (
    <PageHeader
      actions={[
        {
          label: '新增权限',
          onClick: onCreatePermission,
          icon: <Plus className='mr-2 h-4 w-4' />
        }
      ]}
    />
  );
}
