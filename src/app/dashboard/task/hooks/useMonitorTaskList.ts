/**
 * 任务列表 Hook
 *
 * @description
 * 使用通用的 usePageList Hook 管理任务列表
 * - 使用 nuqs 管理 URL 查询参数
 * - 自动加载数据
 * - 提供刷新和搜索方法
 */

import { parseAsInteger, parseAsString } from 'nuqs';
import { usePageList } from '@/hooks/usePageList';
import { TaskApiService } from '@/service/api/task.api';
import type { MonitorTask, MonitorTaskQueryRequest } from '../types';
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
  task_type: parseAsInteger,
  status: parseAsInteger,
  keyword: parseAsString,
  start_time: parseAsString,
  end_time: parseAsString
};

/**
 * 任务列表管理 Hook
 */
export function useMonitorTaskList() {
  const result = usePageList<MonitorTask, MonitorTaskQueryRequest>(
    TaskApiService.getPageList,
    DEFAULT_QUERY_PARAMS,
    filterParsers
  );

  // 重命名 items 为 tasks 以保持向后兼容
  return {
    ...result,
    tasks: result.items
  };
}
