/**
 * 激活码列表管理 Hook
 *
 * @description
 * 使用通用的 usePageList Hook 管理激活码列表
 * - 使用 nuqs 管理 URL 查询参数
 * - 自动加载数据
 * - 提供刷新和搜索方法
 */

import { parseAsInteger, parseAsString } from 'nuqs';
import { usePageList } from '@/hooks/usePageList';
import { ActivationApiService } from '@/service/api/activation.api';
import type { ActivationCode, ActivationCodeQueryRequest } from '../types';
import { DEFAULT_QUERY_PARAMS } from '../constants';

/**
 * nuqs 解析器配置
 * 定义每个查询参数的类型和默认值
 */
const filterParsers = {
  // 分页参数
  page: parseAsInteger.withDefault(DEFAULT_QUERY_PARAMS.page!),
  size: parseAsInteger.withDefault(DEFAULT_QUERY_PARAMS.size!),

  // 筛选参数
  type: parseAsInteger,
  activation_code: parseAsString,
  status: parseAsInteger,
  distributed_at_start: parseAsString,
  distributed_at_end: parseAsString,
  activated_at_start: parseAsString,
  activated_at_end: parseAsString,
  expire_time_start: parseAsString,
  expire_time_end: parseAsString
};

/**
 * 激活码列表管理 Hook
 *
 * @returns 筛选状态、列表数据和操作方法
 */
export function useActivationCodeList() {
  const result = usePageList<ActivationCode, ActivationCodeQueryRequest>(
    ActivationApiService.getPageList,
    DEFAULT_QUERY_PARAMS,
    filterParsers
  );

  // 重命名 items 为 codes 以保持向后兼容
  return {
    ...result,
    codes: result.items
  };
}
