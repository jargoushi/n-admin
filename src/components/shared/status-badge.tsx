import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * 状态配置接口
 */
export interface StatusConfig {
  label: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

interface StatusBadgeProps {
  /** 当前的状态值 (数字或字符串) */
  value: number | string;
  /** 状态值到配置的映射表 */
  mapping: Record<number | string, StatusConfig>;
  /** 额外的样式类 */
  className?: string;
}

export function StatusBadge({ value, mapping, className }: StatusBadgeProps) {
  const config = mapping[value];

  // 如果没有找到映射配置，可以选择不渲染或渲染默认样式
  if (!config) {
    return <span className='text-muted-foreground text-xs'>-</span>;
  }

  return (
    <Badge
      variant={config.variant || 'secondary'}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
