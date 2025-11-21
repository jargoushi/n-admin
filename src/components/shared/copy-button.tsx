'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn, copyToClipboard } from '@/lib/utils';

interface CopyButtonProps {
  /** 必传：要复制的文本 */
  text: string;
  /** 选传：按钮样式变体 */
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link';
  /** 选传：自定义类名 */
  className?: string;
}

export function CopyButton({
  text,
  variant = 'outline',
  className
}: CopyButtonProps) {
  const handleCopy = async (e: React.MouseEvent) => {
    // 阻止事件冒泡（防止点击表格行时触发）
    e.preventDefault();
    e.stopPropagation();

    await copyToClipboard(text);
    toast.success('已复制');
  };

  return (
    <Button
      variant={variant}
      size='sm'
      className={cn('h-8', className)}
      onClick={handleCopy}
    >
      复制
    </Button>
  );
}
