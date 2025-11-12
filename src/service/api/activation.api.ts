/**
 * 激活码 API 服务
 *
 * @description
 * 提供激活码管理的完整 API 接口，包括：
 * - 批量初始化激活码
 * - 派发激活码
 * - 激活码激活
 * - 激活码作废
 * - 查询激活码详情和分页列表
 */

import { http } from '@/lib/http';
import type { ApiResponse, PageResponse, PageRequest } from '@/lib/http';

// ==================== 枚举类型 ====================

/**
 * 激活码类型（与后端 ActivationTypeEnum 一致）
 * - 0: 日卡
 * - 1: 月卡
 * - 2: 年卡
 * - 3: 永久卡
 */
export type ActivationCodeType = 0 | 1 | 2 | 3;

/**
 * 激活码状态
 * - 0: 未使用
 * - 1: 已分发
 * - 2: 已激活
 * - 3: 作废
 */
export type ActivationCodeStatus = 0 | 1 | 2 | 3;

/**
 * 激活码类型名称映射
 */
export const ActivationTypeNames: Record<ActivationCodeType, string> = {
  0: '日卡',
  1: '月卡',
  2: '年卡',
  3: '永久卡'
};

/**
 * 激活码状态名称映射
 */
export const ActivationStatusNames: Record<ActivationCodeStatus, string> = {
  0: '未使用',
  1: '已分发',
  2: '已激活',
  3: '作废'
};

// ==================== 数据模型 ====================

/**
 * 激活码数据结构
 */
export interface ActivationCode {
  /** 激活码 ID */
  id: number;
  /** 激活码字符串 */
  activation_code: string;
  /** 激活码类型码 */
  type: number;
  /** 激活码类型名称 */
  type_name: string;
  /** 激活码状态码 */
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

// ==================== 请求/响应模型 ====================

/**
 * 单个激活码创建项
 */
export interface ActivationCodeCreateItem {
  /** 激活码类型 (0-3) */
  type: number;
  /** 生成数量 (1-1000) */
  count: number;
}

/**
 * 批量创建激活码请求
 */
export interface ActivationCodeBatchCreateRequest {
  /** 激活码创建项列表（最多10项，每种类型只能出现一次） */
  items: ActivationCodeCreateItem[];
}

/**
 * 单个类型的激活码结果
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
 * 批量激活码响应
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
 * 获取/派发激活码请求
 */
export interface ActivationCodeGetRequest {
  /** 激活码类型 (0-3) */
  type: number;
  /** 查询/派发数量，默认1条 (1-100) */
  count?: number;
}

/**
 * 作废激活码请求
 */
export interface ActivationCodeInvalidateRequest {
  /** 激活码字符串 */
  activation_code: string;
}

/**
 * 激活码列表查询参数
 */
export interface ActivationCodeQueryRequest extends PageRequest {
  /** 激活码类型 (0-3) */
  type?: number;
  /** 激活码（精准匹配） */
  activation_code?: string;
  /** 激活码状态 (0-3) */
  status?: number;
  /** 分发时间开始（包含） */
  distributed_at_start?: string;
  /** 分发时间结束（包含） */
  distributed_at_end?: string;
  /** 激活时间开始（包含） */
  activated_at_start?: string;
  /** 激活时间结束（包含） */
  activated_at_end?: string;
  /** 过期时间开始（包含） */
  expire_time_start?: string;
  /** 过期时间结束（包含） */
  expire_time_end?: string;
  /** QueryParams 兼容索引签名 */
  [key: string]: string | number | undefined;
}

// ==================== API 服务类 ====================

/**
 * 激活码 API 服务类
 */
export class ActivationApiService {
  /**
   * 初始化激活码数据（批量创建）
   *
   * @description
   * 根据类型批量生成激活码，自动维护过期时间
   *
   * @param request - 批量创建请求
   * @returns 批量创建响应（包含各类型的激活码列表和汇总信息）
   */
  static async init(
    request: ActivationCodeBatchCreateRequest
  ): Promise<ApiResponse<ActivationCodeBatchResponse>> {
    return http.post<
      ActivationCodeBatchResponse,
      ActivationCodeBatchCreateRequest
    >('/activation/init', request);
  }

  /**
   * 派发激活码
   *
   * @description
   * 根据类型查询指定数量未使用的激活码，并更新状态为已分发
   *
   * @param request - 派发请求（类型和数量）
   * @returns 激活码字符串列表
   */
  static async distribute(
    request: ActivationCodeGetRequest
  ): Promise<ApiResponse<string[]>> {
    return http.post<string[], ActivationCodeGetRequest>(
      '/activation/distribute',
      request
    );
  }

  /**
   * 激活激活码
   *
   * @description
   * 将已分发状态的激活码激活，设置激活时间和过期时间
   *
   * @param activationCode - 激活码字符串
   * @returns 激活后的激活码详细信息
   */
  static async activate(
    activationCode: string
  ): Promise<ApiResponse<ActivationCode>> {
    return http.post<ActivationCode>(
      `/activation/activate?activation_code=${encodeURIComponent(activationCode)}`
    );
  }

  /**
   * 激活码作废
   *
   * @description
   * 将已分发或已激活状态的激活码作废
   *
   * @param request - 作废请求（激活码字符串）
   * @returns 作废结果（true=成功，false=失败）
   */
  static async invalidate(
    request: ActivationCodeInvalidateRequest
  ): Promise<ApiResponse<boolean>> {
    return http.post<boolean, ActivationCodeInvalidateRequest>(
      '/activation/invalidate',
      request
    );
  }

  /**
   * 获取激活码详情
   *
   * @description
   * 根据激活码字符串获取详细信息
   *
   * @param activationCode - 激活码字符串
   * @returns 激活码详细信息
   */
  static async getDetail(
    activationCode: string
  ): Promise<ApiResponse<ActivationCode>> {
    return http.get<ActivationCode>(
      '/activation/{activation_code}',
      undefined,
      {
        pathParams: { activation_code: activationCode }
      }
    );
  }

  /**
   * 获取激活码分页列表
   *
   * @description
   * 分页查询激活码列表，支持多种筛选条件
   *
   * @param params - 查询参数（分页、类型、状态、时间范围等）
   * @returns 激活码分页数据
   */
  static async getPageList(
    params?: ActivationCodeQueryRequest
  ): Promise<ApiResponse<PageResponse<ActivationCode>>> {
    return http.post<
      PageResponse<ActivationCode>,
      ActivationCodeQueryRequest | undefined
    >('/activation/pageList', params);
  }
}
