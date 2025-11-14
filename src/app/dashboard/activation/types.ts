/**
 * 激活码管理模块类型定义
 *
 * @description
 * 定义激活码模块所需的所有 TypeScript 接口和类型
 * 包括实体类型、筛选条件、表单数据、Hook 返回值等
 */

/**
 * 激活码实体（与后端 ActivationCodeResponse 一致）
 */
export interface ActivationCode {
  /** 激活码 ID */
  id: number;
  /** 激活码字符串 */
  activation_code: string;
  /** 激活码类型码 (0=日卡, 1=月卡, 2=年卡, 3=永久卡) */
  type: number;
  /** 激活码类型名称 */
  type_name: string;
  /** 激活码状态码 (0=未使用, 1=已分发, 2=已激活, 3=作废) */
  status: number;
  /** 激活码状态名称 */
  status_name: string;
  /** 分发时间 */
  distributed_at?: string;
  /** 激活时间 */
  activated_at?: string;
  /** 过期时间 */
  expire_time?: string;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}

/**
 * 激活码筛选条件
 */
export interface ActivationCodeFilters {
  /** 激活码（精准匹配） */
  activation_code?: string;
  /** 激活码类型 (0-3) */
  type?: number | 'all';
  /** 激活码状态 (0-3) */
  status?: number | 'all';
  /** 分发时间范围 */
  distributedDateRange?: { from: Date; to: Date } | undefined;
  /** 激活时间范围 */
  activatedDateRange?: { from: Date; to: Date } | undefined;
  /** 过期时间范围 */
  expireDateRange?: { from: Date; to: Date } | undefined;
  /** 当前页码 */
  page?: number;
  /** 每页数量 */
  size?: number;
}

/**
 * 分页信息
 */
export interface PaginationInfo {
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  limit: number;
  /** 总记录数 */
  total: number;
  /** 总页数 */
  totalPages: number;
}

/**
 * 批量初始化单个创建项
 */
export interface ActivationCodeBatchInitItem {
  /** 激活码类型 (0-3) */
  type: number;
  /** 生成数量 (1-1000) */
  count: number;
}

/**
 * 批量初始化表单数据
 */
export interface ActivationCodeInitFormData {
  /** 创建项列表（最多10项，每种类型只能出现一次） */
  items: ActivationCodeBatchInitItem[];
}

/**
 * 派发激活码表单数据
 */
export interface ActivationCodeDistributeFormData {
  /** 激活码类型 (0-3) */
  type: number;
  /** 派发数量 (1-100) */
  count: number;
}

/**
 * 批量初始化响应结果（单个类型）
 */
export interface ActivationCodeTypeResult {
  /** 类型码 */
  type: number;
  /** 类型名称 */
  type_name: string;
  /** 激活码字符串列表 */
  activation_codes: string[];
  /** 数量 */
  count: number;
}

/**
 * 批量初始化响应
 */
export interface ActivationCodeBatchResponse {
  /** 各类型激活码结果列表 */
  results: ActivationCodeTypeResult[];
  /** 总数量 */
  total_count: number;
  /** 各类型数量汇总 */
  summary: Record<string, number>;
}

/**
 * 激活码管理操作方法集合
 */
export interface ActivationCodeManagementActions {
  /** 获取激活码列表 */
  fetchActivationCodes: (filters: ActivationCodeFilters) => Promise<void>;
  /** 批量初始化激活码 */
  initActivationCodes: (
    data: ActivationCodeInitFormData
  ) => Promise<ActivationCodeBatchResponse | null>;
  /** 派发激活码 */
  distributeActivationCodes: (
    data: ActivationCodeDistributeFormData
  ) => Promise<string[] | null>;
  /** 激活激活码 */
  activateCode: (activationCode: string) => Promise<boolean>;
  /** 作废激活码 */
  invalidateCode: (activationCode: string) => Promise<boolean>;
  /** 获取激活码详情 */
  getCodeDetail: (activationCode: string) => Promise<ActivationCode | null>;
}

/**
 * 对话框状态
 */
export interface ActivationCodeDialogState {
  /** 对话框类型 */
  type: 'init' | 'distribute' | 'detail' | null;
  /** 激活码数据（详情对话框使用） */
  data: ActivationCode | null;
  /** 是否打开 */
  open: boolean;
}

/**
 * 表格列配置
 */
export interface TableColumn {
  /** 列键名 */
  key: string;
  /** 列标题 */
  title: string;
  /** 列样式类名 */
  className?: string;
  /** 自定义渲染函数 */
  render?: (
    value: unknown,
    record: ActivationCode,
    index: number
  ) => React.ReactNode;
}
