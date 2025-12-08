/**
 * 监控配置 API 服务
 *
 * @description
 * 提供监控配置管理的完整 API 接口，包括：
 * - 创建监控配置
 * - 分页查询监控列表
 * - 修改监控配置
 * - 切换监控状态
 * - 删除监控配置
 * - 查询每日明细数据
 */

import { http } from '@/lib/http';
import type { PageResponse } from '@/lib/http';

// 从模块 types.ts 导入所有类型定义
import type {
  MonitorConfig,
  MonitorConfigCreateRequest,
  MonitorConfigUpdateRequest,
  MonitorConfigToggleRequest,
  MonitorConfigQueryRequest,
  MonitorDailyStatsQueryRequest,
  MonitorDailyStats
} from '@/app/dashboard/monitor/types';

// ==================== API 服务类 ====================

/**
 * 监控配置 API 服务类
 */
export class MonitorApiService {
  /**
   * 创建监控配置
   *
   * @description
   * 创建新的监控配置，指定渠道和目标链接
   *
   * @param request - 创建请求
   * @returns 创建后的监控配置详细信息
   */
  static async create(
    request: MonitorConfigCreateRequest
  ): Promise<MonitorConfig> {
    return http.post<MonitorConfig, MonitorConfigCreateRequest>(
      '/monitor/config',
      request
    );
  }

  /**
   * 获取监控配置分页列表
   *
   * @description
   * 分页查询监控配置列表，支持多种筛选条件
   *
   * @param params - 查询参数（分页、渠道、状态、时间范围等）
   * @returns 监控配置分页数据
   */
  static async getPageList(
    params?: MonitorConfigQueryRequest
  ): Promise<PageResponse<MonitorConfig>> {
    return http.post<
      PageResponse<MonitorConfig>,
      MonitorConfigQueryRequest | undefined
    >('/monitor/config/pageList', params);
  }

  /**
   * 修改监控配置
   *
   * @description
   * 修改指定监控配置的目标链接
   *
   * @param configId - 配置ID
   * @param request - 修改请求
   * @returns 修改后的监控配置详细信息
   */
  static async update(
    configId: number,
    request: MonitorConfigUpdateRequest
  ): Promise<MonitorConfig> {
    return http.post<
      MonitorConfig,
      MonitorConfigUpdateRequest & { config_id: number }
    >('/monitor/config/update', {
      ...request,
      config_id: configId
    });
  }

  /**
   * 切换监控状态
   *
   * @description
   * 切换监控配置的启用/禁用状态
   *
   * @param configId - 配置ID
   * @param request - 切换请求
   * @returns 切换后的监控配置详细信息
   */
  static async toggle(
    configId: number,
    request: MonitorConfigToggleRequest
  ): Promise<MonitorConfig> {
    return http.post<
      MonitorConfig,
      MonitorConfigToggleRequest & { config_id: number }
    >('/monitor/config/toggle', {
      ...request,
      config_id: configId
    });
  }

  /**
   * 删除监控配置
   *
   * @description
   * 删除指定的监控配置（软删除）
   *
   * @param configId - 配置ID
   * @returns 删除结果（true=成功，false=失败）
   */
  static async delete(configId: number): Promise<boolean> {
    return http.post<boolean, { config_id: number }>('/monitor/config/delete', {
      config_id: configId
    });
  }

  /**
   * 查询每日明细数据
   *
   * @description
   * 查询指定配置的每日明细数据（用于图表展示）
   *
   * @param request - 查询请求（配置ID、日期范围）
   * @returns 每日明细数据列表
   */
  static async getDailyStats(
    request: MonitorDailyStatsQueryRequest
  ): Promise<MonitorDailyStats[]> {
    return http.post<MonitorDailyStats[], MonitorDailyStatsQueryRequest>(
      '/monitor/stats/daily',
      request
    );
  }
}
