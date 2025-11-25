/**
 * 激活码业务逻辑管理 Hook
 *
 * @description
 * 管理激活码的数据获取和业务操作
 * 提供列表查询、批量初始化、派发、激活、作废等功能
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ActivationApiService } from '@/service/api/activation.api';
import type {
  ActivationCode,
  ActivationCodeQueryRequest,
  ActivationCodeBatchCreateRequest,
  ActivationCodeGetRequest,
  ActivationCodeBatchResponse
} from '../types';
import type { PaginationInfo } from '@/lib/http/types';
import { DEFAULT_PAGINATION } from '../constants';

/**
 * 激活码管理 Hook 返回值
 */
interface UseActivationCodeManagementReturn {
  /** 激活码列表 */
  codes: ActivationCode[];
  /** 加载状态 */
  loading: boolean;
  /** 分页信息 */
  pagination: PaginationInfo;
  /** 获取激活码列表 */
  fetchActivationCodes: (params: ActivationCodeQueryRequest) => Promise<void>;
  /** 批量初始化激活码 */
  initActivationCodes: (
    data: ActivationCodeBatchCreateRequest
  ) => Promise<ActivationCodeBatchResponse | null>;
  /** 派发激活码 */
  distributeActivationCodes: (
    data: ActivationCodeGetRequest
  ) => Promise<string[] | null>;
  /** 激活激活码 */
  activateCode: (activationCode: string) => Promise<void>;
  /** 作废激活码 */
  invalidateCode: (activationCode: string) => Promise<void>;
  /** 获取激活码详情 */
  getCodeDetail: (activationCode: string) => Promise<ActivationCode | null>;
}

/**
 * 激活码业务逻辑管理 Hook
 *
 * @description
 * 提供激活码的完整业务逻辑管理
 * - 列表查询（支持筛选和分页）
 * - 批量初始化
 * - 派发激活码
 * - 激活码激活
 * - 激活码作废
 * - 获取详情
 *
 * @returns {UseActivationCodeManagementReturn} 激活码数据和操作方法
 */
export function useActivationCodeManagement(): UseActivationCodeManagementReturn {
  // 状态管理
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] =
    useState<PaginationInfo>(DEFAULT_PAGINATION);

  /**
   * 获取激活码列表
   *
   * @param params - 查询参数（与后端 API 一致）
   */
  const fetchActivationCodes = useCallback(
    async (params: ActivationCodeQueryRequest) => {
      setLoading(true);

      try {
        // 直接将参数传给 API
        const response = await ActivationApiService.getPageList(params);

        const { items, ...paginationInfo } = response;
        setCodes(items);
        setPagination(paginationInfo);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * 批量初始化激活码
   *
   * @param data - 初始化表单数据
   * @returns 批量初始化响应
   */
  const initActivationCodes = useCallback(
    async (
      data: ActivationCodeBatchCreateRequest
    ): Promise<ActivationCodeBatchResponse> => {
      return await ActivationApiService.init(data);
    },
    []
  );

  /**
   * 派发激活码
   *
   * @param data - 派发表单数据
   * @returns 派发的激活码字符串数组或 null
   */
  const distributeActivationCodes = useCallback(
    async (data: ActivationCodeGetRequest): Promise<string[] | null> => {
      return await ActivationApiService.distribute(data);
    },
    []
  );

  /**
   * 激活激活码
   *
   * @param activationCode - 激活码字符串
   * @returns 是否成功
   */
  const activateCode = useCallback(
    async (activationCode: string): Promise<void> => {
      await ActivationApiService.activate(activationCode);
    },
    []
  );

  /**
   * 作废激活码
   *
   * @param activationCode - 激活码字符串
   * @returns 是否成功
   */
  const invalidateCode = useCallback(
    async (activationCode: string): Promise<void> => {
      await ActivationApiService.invalidate({
        activation_code: activationCode
      });
    },
    []
  );

  /**
   * 获取激活码详情
   *
   * @param activationCode - 激活码字符串
   * @returns 激活码详情或 null
   */
  const getCodeDetail = useCallback(
    async (activationCode: string): Promise<ActivationCode | null> => {
      return await ActivationApiService.getDetail(activationCode);
    },
    []
  );

  return {
    codes,
    loading,
    pagination,
    fetchActivationCodes,
    initActivationCodes,
    distributeActivationCodes,
    activateCode,
    invalidateCode,
    getCodeDetail
  };
}
