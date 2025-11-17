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
  ActivationCodeFilters,
  PaginationInfo,
  ActivationCodeInitFormData,
  ActivationCodeDistributeFormData,
  ActivationCodeBatchResponse,
  ActivationCodeManagementActions
} from '../types';
import { DEFAULT_PAGINATION, MESSAGES } from '../constants';

/**
 * 激活码管理 Hook 返回值
 */
interface UseActivationCodeManagementReturn
  extends ActivationCodeManagementActions {
  /** 激活码列表 */
  codes: ActivationCode[];
  /** 加载状态 */
  loading: boolean;
  /** 分页信息 */
  pagination: PaginationInfo;
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
   * @param filters - 筛选条件
   */
  const fetchActivationCodes = useCallback(
    async (filters: ActivationCodeFilters) => {
      try {
        setLoading(true);

        // 构建查询参数
        const queryParams: Record<string, string | number | undefined> = {
          page: filters.page || 1,
          size: filters.size || 10
        };

        // 激活码精确匹配
        if (filters.activation_code) {
          queryParams.activation_code = filters.activation_code;
        }

        // 类型筛选
        if (filters.type !== undefined && filters.type !== 'all') {
          queryParams.type = filters.type;
        }

        // 状态筛选
        if (filters.status !== undefined && filters.status !== 'all') {
          queryParams.status = filters.status;
        }

        // 分发时间范围
        if (filters.distributedDateRange) {
          queryParams.distributed_at_start =
            filters.distributedDateRange.from.toISOString();
          queryParams.distributed_at_end =
            filters.distributedDateRange.to.toISOString();
        }

        // 激活时间范围
        if (filters.activatedDateRange) {
          queryParams.activated_at_start =
            filters.activatedDateRange.from.toISOString();
          queryParams.activated_at_end =
            filters.activatedDateRange.to.toISOString();
        }

        // 过期时间范围
        if (filters.expireDateRange) {
          queryParams.expire_time_start =
            filters.expireDateRange.from.toISOString();
          queryParams.expire_time_end =
            filters.expireDateRange.to.toISOString();
        }

        // 调用 API（拦截器已解包 ApiResponse，直接返回 PageResponse）
        const response = await ActivationApiService.getPageList(queryParams);

        setCodes(response.items);
        setPagination({
          page: response.page,
          limit: response.size,
          total: response.total,
          totalPages: response.pages
        });
      } catch (error) {
        console.error('[fetchActivationCodes] Error:', error);
        toast.error(MESSAGES.ERROR.FETCH_LIST);
        setCodes([]);
        setPagination(DEFAULT_PAGINATION);
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
   * @returns 批量初始化响应或 null
   */
  const initActivationCodes = useCallback(
    async (
      data: ActivationCodeInitFormData
    ): Promise<ActivationCodeBatchResponse | null> => {
      try {
        const response = await ActivationApiService.init(data);
        toast.success(MESSAGES.SUCCESS.INIT);
        return response;
      } catch (error) {
        console.error('[initActivationCodes] Error:', error);
        toast.error(MESSAGES.ERROR.INIT);
        return null;
      }
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
    async (
      data: ActivationCodeDistributeFormData
    ): Promise<string[] | null> => {
      try {
        const response = await ActivationApiService.distribute(data);
        toast.success(MESSAGES.SUCCESS.DISTRIBUTE);
        return response;
      } catch (error) {
        console.error('[distributeActivationCodes] Error:', error);
        toast.error(MESSAGES.ERROR.DISTRIBUTE);
        return null;
      }
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
    async (activationCode: string): Promise<boolean> => {
      try {
        await ActivationApiService.activate(activationCode);
        toast.success(MESSAGES.SUCCESS.ACTIVATE);
        return true;
      } catch (error) {
        console.error('[activateCode] Error:', error);
        toast.error(MESSAGES.ERROR.ACTIVATE);
        return false;
      }
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
    async (activationCode: string): Promise<boolean> => {
      try {
        await ActivationApiService.invalidate({
          activation_code: activationCode
        });
        toast.success(MESSAGES.SUCCESS.INVALIDATE);
        return true;
      } catch (error) {
        console.error('[invalidateCode] Error:', error);
        toast.error(MESSAGES.ERROR.INVALIDATE);
        return false;
      }
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
      try {
        const response = await ActivationApiService.getDetail(activationCode);
        return response;
      } catch (error) {
        console.error('[getCodeDetail] Error:', error);
        toast.error(MESSAGES.ERROR.FETCH_DETAIL);
        return null;
      }
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
