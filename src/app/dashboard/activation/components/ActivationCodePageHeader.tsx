import React from 'react';
import { Plus, Send } from 'lucide-react';
import { PageHeader } from '@/components/table/page-header';

interface ActivationCodePageHeaderProps {
  /** 批量初始化按钮点击事件 */
  onInit: () => void;
  /** 派发激活码按钮点击事件 */
  onDistribute: () => void;
}

/**
 * 激活码页面头部组件
 * 负责页面标题和操作按钮（批量初始化、派发激活码）
 */
export function ActivationCodePageHeader({
  onInit,
  onDistribute
}: ActivationCodePageHeaderProps) {
  return (
    <PageHeader
      actions={[
        {
          label: '派发激活码',
          onClick: onDistribute,
          icon: <Send className='mr-2 h-4 w-4' />
        },
        {
          label: '批量初始化',
          onClick: onInit,
          icon: <Plus className='mr-2 h-4 w-4' />
        }
      ]}
    />
  );
}
