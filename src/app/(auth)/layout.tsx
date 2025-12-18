/**
 * Auth 布局
 *
 * @description
 * 认证页面（登录/注册）的布局，无侧边栏
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '登录'
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      <div className='w-full max-w-md px-4'>{children}</div>
    </div>
  );
}
