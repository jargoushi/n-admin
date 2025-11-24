/**
 * 激活码管理模块常量配置
 *
 * @description
 * 定义模块所需的所有常量，包括分页配置、下拉选项、
 * 表格列定义、消息文案等
 */

import type { PaginationInfo, ActivationCodeQueryRequest } from './types';

// ==================== 分页配置 ====================

/**
 * 默认分页配置
 */
export const DEFAULT_PAGINATION: PaginationInfo = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
};

// ==================== 激活码类型配置 ====================

/**
 * 激活码类型统一配置(唯一真相源)
 */
export const ACTIVATION_CODE_TYPES = {
  0: { label: '日卡', variant: 'secondary' as const },
  1: { label: '月卡', variant: 'default' as const },
  2: { label: '年卡', variant: 'outline' as const },
  3: { label: '永久卡', variant: 'default' as const }
} as const;

/**
 * 激活码类型选项(用于下拉选择,从统一配置派生)
 */
export const ACTIVATION_CODE_TYPE_OPTIONS = Object.entries(
  ACTIVATION_CODE_TYPES
).map(([value, config]) => ({
  label: config.label,
  value: Number(value)
}));

// ==================== 激活码状态配置 ====================

/**
 * 激活码状态统一配置(唯一真相源)
 */
export const ACTIVATION_CODE_STATUSES = {
  0: { label: '未使用', variant: 'secondary' as const },
  1: { label: '已分发', variant: 'default' as const },
  2: { label: '已激活', variant: 'default' as const },
  3: { label: '作废', variant: 'destructive' as const }
} as const;

/**
 * 激活码状态选项(用于下拉选择,从统一配置派生)
 */
export const ACTIVATION_CODE_STATUS_OPTIONS = Object.entries(
  ACTIVATION_CODE_STATUSES
).map(([value, config]) => ({
  label: config.label,
  value: Number(value)
}));

// ==================== 默认查询参数 ====================

/**
 * 默认查询参数（与后端 API 一致）
 */
export const DEFAULT_QUERY_PARAMS: ActivationCodeQueryRequest = {
  page: 1,
  size: 10
};

// ==================== 验证规则 ====================

/**
 * 批量初始化最大项数
 * 根据激活码类型数量动态计算
 * 每种激活码类型只能初始化一次
 */
export const MAX_INIT_ITEMS = ACTIVATION_CODE_TYPE_OPTIONS.length;

/**
 * 单次生成数量范围
 */
export const INIT_COUNT_RANGE = {
  MIN: 1,
  MAX: 1000
} as const;

/**
 * 派发数量范围
 */
export const DISTRIBUTE_COUNT_RANGE = {
  MIN: 1,
  MAX: 100
} as const;
