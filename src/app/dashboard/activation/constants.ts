/**
 * 激活码管理模块常量配置
 *
 * @description
 * 定义模块所需的所有常量，包括分页配置、下拉选项、
 * 表格列定义、消息文案等
 */

import type { PaginationInfo, ActivationCodeFilters } from './types';

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
 * 激活码类型选项（用于下拉选择）
 */
export const ACTIVATION_CODE_TYPE_OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '日卡', value: 0 },
  { label: '月卡', value: 1 },
  { label: '年卡', value: 2 },
  { label: '永久卡', value: 3 }
] as const;

/**
 * 激活码类型徽章样式映射
 */
export const CODE_TYPE_CONFIG = {
  0: { label: '日卡', variant: 'secondary' as const },
  1: { label: '月卡', variant: 'default' as const },
  2: { label: '年卡', variant: 'outline' as const },
  3: { label: '永久卡', variant: 'default' as const }
};

// ==================== 激活码状态配置 ====================

/**
 * 激活码状态选项（用于下拉选择）
 */
export const ACTIVATION_CODE_STATUS_OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '未使用', value: 0 },
  { label: '已分发', value: 1 },
  { label: '已激活', value: 2 },
  { label: '作废', value: 3 }
] as const;

/**
 * 激活码状态徽章样式映射
 */
export const STATUS_BADGE_MAP = {
  0: { label: '未使用', variant: 'secondary' as const },
  1: { label: '已分发', variant: 'default' as const },
  2: { label: '已激活', variant: 'default' as const },
  3: { label: '作废', variant: 'destructive' as const }
};

// ==================== 默认筛选条件 ====================

/**
 * 默认筛选条件
 */
export const DEFAULT_FILTERS: ActivationCodeFilters = {
  activation_code: '',
  type: 'all',
  status: 'all',
  distributedDateRange: undefined,
  activatedDateRange: undefined,
  expireDateRange: undefined,
  page: 1,
  size: 10
};

// ==================== 消息文案 ====================

/**
 * 统一消息文案
 */
export const MESSAGES = {
  SUCCESS: {
    INIT: '批量初始化激活码成功',
    DISTRIBUTE: '派发激活码成功',
    ACTIVATE: '激活码激活成功',
    INVALIDATE: '激活码作废成功'
  },
  ERROR: {
    INVALID_FORM: '请填写完整的表单信息',
    DUPLICATE_TYPE: '激活码类型重复，每种类型只能出现一次'
  },
  CONFIRM: {
    ACTIVATE: (code: string) =>
      `确定要激活激活码 "${code.substring(0, 20)}..." 吗？`,
    INVALIDATE: (code: string) =>
      `确定要作废激活码 "${code.substring(0, 20)}..." 吗？\n\n作废后将无法恢复！`
  },
  PLACEHOLDER: {
    SEARCH: '请输入激活码进行精确搜索',
    SELECT_TYPE: '请选择激活码类型',
    SELECT_STATUS: '请选择激活码状态',
    INPUT_COUNT: '请输入生成数量'
  }
};

// ==================== 验证规则 ====================

/**
 * 批量初始化最大项数
 * 根据激活码类型数量动态计算（排除"全部"选项）
 * 每种激活码类型只能初始化一次
 */
export const MAX_INIT_ITEMS = ACTIVATION_CODE_TYPE_OPTIONS.filter(
  (opt) => opt.value !== 'all'
).length;

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
