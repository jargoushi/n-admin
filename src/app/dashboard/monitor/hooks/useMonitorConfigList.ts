/**
 * 监控配置列表 Hook
 *
 * @description
 * 使用通用的 usePageList Hook 管理监控配置列表
 * - 使用 nuqs 管理 URL 查询参数
 * - 自动加载数据
 * - 提供刷新和搜索方法
 */

import { parseAsInteger, parseAsString } from 'nuqs';
import { usePageList } from '@/hooks/usePageList';
import { MonitorApiService } from '@/service/api/monitor.api';
import type { MonitorConfig, MonitorConfigQueryRequest } from '../types';
import { DEFAULT_QUERY_PARAMS } from '../constants';

/**
 * nuqs 解析器配置
 */
const filterParsers = {
  // 分页参数
  page: parseAsInteger.withDefault(DEFAULT_QUERY_PARAMS.page!),
  size: parseAsInteger.withDefault(DEFAULT_QUERY_PARAMS.size!),

  // 筛选参数
  channel_type: parseAsInteger,
  keyword: parseAsString,
  is_active: parseAsInteger
};

/**
 * 监控配置列表管理 Hook
 */
export function useMonitorConfigList() {
  const result = usePageList<MonitorConfig, MonitorConfigQueryRequest>(
    MonitorApiService.getPageList,
    DEFAULT_QUERY_PARAMS,
    filterParsers
  );

  // 重命名 items 为 configs 以保持向后兼容
  return {
    ...result,
    configs: result.items
  };
}
