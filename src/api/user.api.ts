/**
 * 用户 API 服务
 *
 * 演示如何使用 @/lib/http 模块创建类型安全的 API 服务
 */

import { http } from '@/lib/http';
import type { ApiResponse, PageResponse, PageRequest } from '@/lib/http';

/**
 * 用户数据类型
 */
export interface User {
  /** 用户 ID */
  id: number;
  /** 用户名 */
  username: string;
  /** 邮箱 */
  email: string;
  /** 头像 URL */
  avatar?: string;
  /** 角色 ID */
  roleId: number;
  /** 状态 */
  status: 'active' | 'disabled';
  /** 是否超级管理员 */
  isSuperAdmin: boolean;
  /** 最后登录时间 */
  lastLoginAt?: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/**
 * 用户筛选参数（继承分页参数）
 */
export interface UserFilters extends PageRequest {
  /** 用户名（模糊搜索） */
  username?: string;
  /** 邮箱（模糊搜索） */
  email?: string;
  /** 角色 ID */
  roleId?: number;
  /** 状态筛选 */
  status?: 'active' | 'disabled';
  /** 开始日期 */
  startDate?: string;
  /** 结束日期 */
  endDate?: string;
  /** 索引签名，允许任意字符串键 */
  [key: string]: string | number | undefined;
}

/**
 * 创建用户参数
 */
export interface CreateUserDto {
  /** 用户名 */
  username: string;
  /** 邮箱 */
  email: string;
  /** 密码 */
  password: string;
  /** 角色 ID */
  roleId: number;
  /** 头像 URL（可选） */
  avatar?: string;
}

/**
 * 更新用户参数
 */
export interface UpdateUserDto {
  /** 用户名 */
  username?: string;
  /** 邮箱 */
  email?: string;
  /** 角色 ID */
  roleId?: number;
  /** 头像 URL */
  avatar?: string;
  /** 状态 */
  status?: 'active' | 'disabled';
}

/**
 * 用户 API 服务类
 */
export class UserApiService {
  /**
   * 获取用户列表（分页）
   * @param filters - 筛选参数
   * @returns 包含分页信息的用户列表响应
   *
   * @example
   * const res = await UserApiService.getUsers({ page: 1, size: 10, username: 'admin' });
   * console.log(res.data?.items); // User[]
   * console.log(res.data?.total); // 100
   * console.log(res.data?.page);  // 1
   * console.log(res.data?.size);  // 10
   * console.log(res.data?.pages); // 10
   */
  static async getUsers(
    filters?: UserFilters
  ): Promise<ApiResponse<PageResponse<User>>> {
    return http.get<PageResponse<User>>('/users', filters);
  }

  /**
   * 获取单个用户详情
   * @param id - 用户 ID
   * @returns 用户详情响应
   *
   * @example
   * const res = await UserApiService.getUser(1);
   * console.log(res.data); // User
   */
  static async getUser(id: number): Promise<ApiResponse<User>> {
    return http.get<User>('/users/{id}', undefined, {
      pathParams: { id }
    });
  }

  /**
   * 创建用户
   * @param data - 创建用户参数
   * @returns 创建的用户数据
   *
   * @example
   * const res = await UserApiService.createUser({
   *   username: 'test',
   *   email: 'test@example.com',
   *   password: '123456',
   *   roleId: 2
   * });
   */
  static async createUser(data: CreateUserDto): Promise<ApiResponse<User>> {
    return http.post<User, CreateUserDto>('/users', data);
  }

  /**
   * 更新用户信息
   * @param id - 用户 ID
   * @param data - 更新参数
   * @returns 更新后的用户数据
   *
   * @example
   * const res = await UserApiService.updateUser(1, { username: 'new_name' });
   */
  static async updateUser(
    id: number,
    data: UpdateUserDto
  ): Promise<ApiResponse<User>> {
    return http.put<User, UpdateUserDto>('/users/{id}', data, {
      pathParams: { id }
    });
  }

  /**
   * 删除用户
   * @param id - 用户 ID
   * @returns 删除结果
   *
   * @example
   * await UserApiService.deleteUser(1);
   */
  static async deleteUser(id: number): Promise<ApiResponse<void>> {
    return http.delete<void>('/users/{id}', {
      pathParams: { id }
    });
  }

  /**
   * 启用/禁用用户
   * @param id - 用户 ID
   * @param status - 目标状态
   * @returns 更新后的用户数据
   *
   * @example
   * // 禁用用户
   * await UserApiService.toggleUserStatus(1, 'disabled');
   *
   * // 启用用户
   * await UserApiService.toggleUserStatus(1, 'active');
   */
  static async toggleUserStatus(
    id: number,
    status: 'active' | 'disabled'
  ): Promise<ApiResponse<User>> {
    return http.patch<User>(
      '/users/{id}/status',
      { status },
      { pathParams: { id } }
    );
  }
}
