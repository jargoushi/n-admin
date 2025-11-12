/**
 * HTTP 请求模块
 *
 * @description
 * 基于 axios 封装的类型安全 HTTP 请求库
 *
 * 核心特性：
 * - 完整的 TypeScript 类型支持（零 any 类型）
 * - 自动 Token 注入（Authorization Header）
 * - 401 自动跳转登录
 * - 统一错误处理和提示
 * - 多环境配置（开发/测试/生产）
 * - RESTful 路径参数支持
 * - 请求/响应拦截器
 *
 * @example
 * ```ts
 * import { http, TokenManager } from '@/lib/http';
 * import type { ApiResponse } from '@/lib/http';
 *
 * // 定义类型
 * interface User {
 *   id: number;
 *   username: string;
 *   email: string;
 * }
 *
 * interface LoginResponse {
 *   token: string;
 *   user: User;
 * }
 *
 * interface CreateUserDto {
 *   username: string;
 *   email: string;
 *   password: string;
 * }
 *
 * // 登录并保存 Token
 * const loginRes = await http.post<LoginResponse>('/auth/login', {
 *   email: 'admin@example.com',
 *   password: '123456'
 * });
 * if (loginRes.data) {
 *   TokenManager.setToken(loginRes.data.token);
 * }
 *
 * // 获取用户列表（自动携带 Token）
 * const usersRes = await http.get<User[]>('/users', { page: 1, limit: 10 });
 * console.log(usersRes.data); // User[] | undefined
 * console.log(usersRes.pager); // PaginationInfo | undefined
 *
 * // RESTful 路径参数
 * const userRes = await http.get<User>('/users/{id}', undefined, {
 *   pathParams: { id: 1 }
 * });
 * console.log(userRes.data); // User | undefined
 *
 * // 创建用户（指定请求体类型）
 * const createRes = await http.post<User, CreateUserDto>('/users', {
 *   username: 'test',
 *   email: 'test@example.com',
 *   password: '123456'
 * });
 *
 * // 更新用户
 * await http.put<User>('/users/{id}',
 *   { username: 'new_name' },
 *   { pathParams: { id: 1 } }
 * );
 *
 * // 删除用户
 * await http.delete('/users/{id}', { pathParams: { id: 1 } });
 * ```
 */

export { HttpRequest as http } from './request';
export { TokenManager } from './token';
export { axiosInstance } from './request';

// 导出类型
export type {
  ApiResponse,
  PageResponse,
  PageRequest,
  QueryParams,
  RequestConfig,
  PathParams,
  HttpError
} from './types';
