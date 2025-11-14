import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { ENV_CONFIG } from './config';
import {
  requestInterceptor,
  requestErrorInterceptor,
  responseInterceptor,
  responseErrorInterceptor
} from './interceptors';
import type {
  RequestConfig,
  PathParams,
  ApiResponse,
  QueryParams
} from './types';

/**
 * 创建 axios 实例
 */
function createInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: ENV_CONFIG.baseURL,
    timeout: ENV_CONFIG.timeout,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // 注册请求拦截器
  instance.interceptors.request.use(
    requestInterceptor,
    requestErrorInterceptor
  );

  // 注册响应拦截器
  // 使用类型断言以允许拦截器返回 ApiResponse 而不是 AxiosResponse
  instance.interceptors.response.use(
    responseInterceptor as unknown as (
      value: AxiosResponse
    ) => AxiosResponse | Promise<AxiosResponse>,
    responseErrorInterceptor
  );

  return instance;
}

const axiosInstance = createInstance();

/**
 * 替换路径中的参数
 * @param path - 路径字符串
 * @param params - 路径参数对象
 * @returns 替换后的路径
 * @example
 * replacePath('/api/user/{id}', { id: 1 }) -> '/api/user/1'
 * replacePath('/api/user/{id}/role/{roleId}', { id: 1, roleId: 2 }) -> '/api/user/1/role/2'
 */
function replacePath(path: string, params: PathParams): string {
  let result = path;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`{${key}}`, String(value));
  });
  return result;
}

/**
 * HTTP 请求类
 * 提供类型安全的 RESTful API 请求方法
 */
export class HttpRequest {
  /**
   * GET 请求
   * @template T - 响应数据类型
   * @param url - 请求地址
   * @param params - 查询参数
   * @param config - 请求配置
   * @returns Promise<T> - 拦截器已解包 ApiResponse，直接返回业务数据
   *
   * @example
   * // 基础用法
   * const users = await http.get<User[]>('/users');
   *
   * // 带查询参数
   * const users = await http.get<User[]>('/users', { page: 1, limit: 10 });
   *
   * // RESTful 路径参数
   * const user = await http.get<User>('/users/{id}', undefined, { pathParams: { id: 1 } });
   */
  static async get<T = unknown>(
    url: string,
    params?: QueryParams,
    config?: RequestConfig & { pathParams?: PathParams }
  ): Promise<T> {
    const finalUrl = config?.pathParams
      ? replacePath(url, config.pathParams)
      : url;
    const response = await axiosInstance.get(finalUrl, { params, ...config });
    // 拦截器返回 ApiResponse<T>，response.data 是业务数据 T
    return response.data;
  }

  /**
   * POST 请求
   * @template T - 响应数据类型
   * @template D - 请求体数据类型
   * @param url - 请求地址
   * @param data - 请求体数据
   * @param config - 请求配置
   * @returns Promise<T> - 拦截器已解包 ApiResponse，直接返回业务数据
   *
   * @example
   * interface CreateUserDto {
   *   username: string;
   *   email: string;
   * }
   *
   * const user = await http.post<User, CreateUserDto>('/users', {
   *   username: 'admin',
   *   email: 'admin@example.com'
   * });
   */
  static async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig & { pathParams?: PathParams }
  ): Promise<T> {
    const finalUrl = config?.pathParams
      ? replacePath(url, config.pathParams)
      : url;
    const response = await axiosInstance.post(finalUrl, data, config);
    // 拦截器返回 ApiResponse<T>，response.data 是业务数据 T
    return response.data;
  }

  /**
   * PUT 请求
   * @template T - 响应数据类型
   * @template D - 请求体数据类型
   * @param url - 请求地址
   * @param data - 请求体数据
   * @param config - 请求配置
   * @returns Promise<T> - 拦截器已解包 ApiResponse，直接返回业务数据
   *
   * @example
   * const user = await http.put<User>('/users/{id}',
   *   { username: 'new_name' },
   *   { pathParams: { id: 1 } }
   * );
   */
  static async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig & { pathParams?: PathParams }
  ): Promise<T> {
    const finalUrl = config?.pathParams
      ? replacePath(url, config.pathParams)
      : url;
    const response = await axiosInstance.put(finalUrl, data, config);
    // 拦截器返回 ApiResponse<T>，response.data 是业务数据 T
    return response.data;
  }

  /**
   * PATCH 请求
   * @template T - 响应数据类型
   * @template D - 请求体数据类型
   * @param url - 请求地址
   * @param data - 请求体数据
   * @param config - 请求配置
   * @returns Promise<T> - 拦截器已解包 ApiResponse，直接返回业务数据
   *
   * @example
   * const user = await http.patch<User>('/users/{id}/status',
   *   { status: 'active' },
   *   { pathParams: { id: 1 } }
   * );
   */
  static async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig & { pathParams?: PathParams }
  ): Promise<T> {
    const finalUrl = config?.pathParams
      ? replacePath(url, config.pathParams)
      : url;
    const response = await axiosInstance.patch(finalUrl, data, config);
    // 拦截器返回 ApiResponse<T>，response.data 是业务数据 T
    return response.data;
  }

  /**
   * DELETE 请求
   * @template T - 响应数据类型
   * @param url - 请求地址
   * @param config - 请求配置
   * @returns Promise<T> - 拦截器已解包 ApiResponse，直接返回业务数据
   *
   * @example
   * const result = await http.delete('/users/{id}', { pathParams: { id: 1 } });
   */
  static async delete<T = unknown>(
    url: string,
    config?: RequestConfig & { pathParams?: PathParams }
  ): Promise<T> {
    const finalUrl = config?.pathParams
      ? replacePath(url, config.pathParams)
      : url;
    const response = await axiosInstance.delete(finalUrl, config);
    // 拦截器返回 ApiResponse<T>，response.data 是业务数据 T
    return response.data;
  }
}

export { axiosInstance };
