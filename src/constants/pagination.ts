/**
 * 分页相关公共配置
 *
 * @description
 * 全局统一的分页配置,所有业务模块都应该从这里导入,避免重复定义
 */

import type { PaginationInfo } from '@/lib/http/types';

/**
 * 默认分页配置
 */
export const DEFAULT_PAGINATION: PaginationInfo = {
  page: 1,
  size: 10,
  total: 0,
  pages: 0
};

/**
 * 默认分页请求参数
 * 用于API请求时的默认值
 */
export const DEFAULT_PAGE_REQUEST = {
  page: 1,
  size: 10
};
