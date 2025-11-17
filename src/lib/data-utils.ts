// src/utils/date.ts
import { format } from 'date-fns';

/**
 * 格式化日期时间字符串
 * @param dateString - 日期字符串
 * @param formatStr - 格式模板（默认：yyyy-MM-dd HH:mm:ss）
 * @returns 格式化后的字符串或 '-'
 */
export function formatDateTime(
  dateString: string | null | undefined,
  formatStr: string = 'yyyy-MM-dd HH:mm:ss'
): string {
  if (!dateString) return '-';
  try {
    return format(new Date(dateString), formatStr);
  } catch {
    return String(dateString);
  }
}

// 导出常用格式
export const DATE_FORMAT = 'yyyy-MM-dd';
export const TIME_FORMAT = 'HH:mm:ss';
