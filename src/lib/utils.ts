import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 获取字符串的首字母并大写
 * @param name 输入字符串
 * @returns 首字母大写
 */
export function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * 复制到剪贴板工具配置
 */
interface CopyToClipboardOptions {
  /** 成功提示信息 */
  successMessage?: string;
  /** 失败提示信息 */
  errorMessage?: string;
  /** 是否显示提示 */
  showToast?: boolean;
}

/**
 * 复制文本到剪贴板
 *
 * @description
 * 统一的剪贴板复制工具，自动处理成功/失败提示
 *
 * @param text - 要复制的文本
 * @param options - 配置选项
 * @returns 是否复制成功
 *
 */
export async function copyToClipboard(
  text: string,
  options: CopyToClipboardOptions = {}
): Promise<boolean> {
  const {
    successMessage = '已复制到剪贴板',
    errorMessage = '复制失败，请重试',
    showToast = true
  } = options;

  try {
    await navigator.clipboard.writeText(text);
    if (showToast) {
      toast.success(successMessage);
    }
    return true;
  } catch {
    if (showToast) {
      toast.error(errorMessage);
    }
    return false;
  }
}

// ==================== 日期格式转换工具 ====================

/**
 * ISO 8601 日期时间格式正则表达式
 * 匹配格式：2025-11-06T16:00:00.000Z 或 2025-11-06T16:00:00Z
 */
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;

/**
 * 格式化日期时间为后端需要的格式
 *
 * @param date - Date 对象或 ISO 字符串
 * @returns 格式化后的字符串 (YYYY-MM-DD HH:mm:ss)
 */
export function formatDateTimeForBackend(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 检查字符串是否为 ISO 8601 日期格式
 *
 * @param value - 要检查的字符串
 * @returns 是否为 ISO 日期格式
 */
export function isISODateString(value: string): boolean {
  return ISO_DATE_REGEX.test(value);
}

/**
 * 转换对象中的所有 ISO 日期字符串为后端格式
 *
 * @param obj - 需要转换的对象
 * @returns 转换后的对象
 */
export function convertDatesInObject(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // 字符串类型：检查是否为 ISO 日期格式
  if (typeof obj === 'string' && isISODateString(obj)) {
    return formatDateTimeForBackend(obj);
  }

  // 数组类型：递归处理每个元素
  if (Array.isArray(obj)) {
    return obj.map((item) => convertDatesInObject(item));
  }

  // 对象类型：递归处理每个属性
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = convertDatesInObject(value);
    }
    return result;
  }

  // 其他类型：原样返回
  return obj;
}
