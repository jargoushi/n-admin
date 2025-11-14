/**
 * 激活码管理模块常量配置
 *
 * @description
 * 定义模块所需的所有常量，包括分页配置、下拉选项、
 * 表格列定义、消息文案等
 */

import type {
  PaginationInfo,
  ActivationCodeFilters,
  TableColumn
} from './types';

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

/**
 * 分页大小选项
 */
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];

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
export const TYPE_BADGE_MAP = {
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

// ==================== 表格列配置 ====================

/**
 * 激活码表格列配置
 */
export const TABLE_COLUMNS: TableColumn[] = [
  {
    key: 'index',
    title: 'ID',
    className: 'w-[60px] text-center'
  },
  {
    key: 'activation_code',
    title: '激活码',
    className: 'min-w-[280px] font-mono font-medium'
  },
  {
    key: 'type',
    title: '类型',
    className: 'w-[100px] text-center'
  },
  {
    key: 'status',
    title: '状态',
    className: 'w-[100px] text-center'
  },
  {
    key: 'distributed_at',
    title: '分发时间',
    className: 'w-[180px]'
  },
  {
    key: 'activated_at',
    title: '激活时间',
    className: 'w-[180px]'
  },
  {
    key: 'expire_time',
    title: '过期时间',
    className: 'w-[180px]'
  },
  {
    key: 'created_at',
    title: '创建时间',
    className: 'w-[180px]'
  },
  {
    key: 'actions',
    title: '操作',
    className: 'w-[120px] text-center'
  }
];

// ==================== 消息文案 ====================

/**
 * 统一消息文案
 */
export const MESSAGES = {
  SUCCESS: {
    INIT: '批量初始化激活码成功',
    DISTRIBUTE: '派发激活码成功',
    ACTIVATE: '激活码激活成功',
    INVALIDATE: '激活码作废成功',
    COPY: '复制成功'
  },
  ERROR: {
    INIT: '批量初始化激活码失败',
    DISTRIBUTE: '派发激活码失败',
    ACTIVATE: '激活码激活失败',
    INVALIDATE: '激活码作废失败',
    FETCH_LIST: '获取激活码列表失败',
    FETCH_DETAIL: '获取激活码详情失败',
    COPY: '复制失败',
    INVALID_FORM: '请填写完整的表单信息',
    DUPLICATE_TYPE: '激活码类型重复，每种类型只能出现一次'
  },
  EMPTY: {
    DISTRIBUTED: '未分发',
    ACTIVATED: '未激活',
    EXPIRED: '永久有效'
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

// ==================== 日期时间格式 ====================

/**
 * 日期时间显示格式
 */
export const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';

/**
 * 日期显示格式
 */
export const DATE_FORMAT = 'yyyy-MM-dd';

// ==================== 验证规则 ====================

/**
 * 批量初始化最大项数
 * 每种激活码类型（日卡、月卡、年卡、永久卡）只能初始化一次，共4种
 */
export const MAX_INIT_ITEMS = 4;

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

/**
 * 激活码类型范围
 */
export const CODE_TYPE_RANGE = {
  MIN: 0,
  MAX: 3
} as const;

/**
 * 激活码状态范围
 */
export const CODE_STATUS_RANGE = {
  MIN: 0,
  MAX: 3
} as const;
