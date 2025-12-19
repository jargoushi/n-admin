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
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-background'>
      {/* 全局背景装饰 - 与 root layout 保持一致 */}
      <div className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
        <div className='bg-primary/5 absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-[120px]' />
        <div className='bg-accent/5 absolute top-[10%] -right-[10%] h-[40%] w-[40%] rounded-full blur-[120px]' />
        <div className='bg-primary/3 absolute bottom-[-10%] left-[20%] h-[40%] w-[40%] rounded-full blur-[120px]' />
      </div>

      <div className='relative z-10 w-full max-w-md px-4'>{children}</div>
    </div>
  );
}
