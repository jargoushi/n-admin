const TOKEN_KEY = 'access_token';

/**
 * Token 管理工具类
 */
export class TokenManager {
  /**
   * 获取访问令牌
   * @returns Token 字符串或 null
   */
  static getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * 设置访问令牌
   * @param token - Token 字符串
   */
  static setToken(token: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * 移除访问令牌（登出时调用）
   */
  static removeToken(): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem(TOKEN_KEY);
  }

  /**
   * 检查 Token 是否存在
   * @returns true 如果存在，否则 false
   */
  static hasToken(): boolean {
    return !!this.getToken();
  }
}
