/**
 * 激活码页面头部组件
 *
 * @description
 * 显示页面标题和操作按钮（批量初始化、派发激活码）
 */

import { Plus, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * 页面头部组件属性
 */
interface ActivationCodePageHeaderProps {
  /** 批量初始化按钮点击事件 */
  onInit: () => void;
  /** 派发激活码按钮点击事件 */
  onDistribute: () => void;
}

/**
 * 激活码页面头部组件
 *
 * @param props - 组件属性
 * @returns 页面头部组件
 */
export function ActivationCodePageHeader({
  onInit,
  onDistribute
}: ActivationCodePageHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>激活码管理</h1>
        <p className='text-muted-foreground text-sm'>
          管理激活码的生成、派发、激活和作废
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <Button onClick={onDistribute} variant='default'>
          <Send className='mr-2 h-4 w-4' />
          派发激活码
        </Button>
        <Button onClick={onInit} variant='default'>
          <Plus className='mr-2 h-4 w-4' />
          批量初始化
        </Button>
      </div>
    </div>
  );
}
