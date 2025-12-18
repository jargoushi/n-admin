/**
 * 登录表单组件
 *
 * @description
 * 用户登录表单，使用 react-hook-form 管理表单状态
 * 支持记住用户名功能
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { AuthApiService } from '@/service/api/auth.api';

const REMEMBER_KEY = 'remember_username';

interface LoginFormData {
  username: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  // 加载记住的用户名
  useEffect(() => {
    const savedUsername = localStorage.getItem(REMEMBER_KEY);
    if (savedUsername) {
      setValue('username', savedUsername);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await AuthApiService.login(data.username, data.password);

      // 处理记住用户名
      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, data.username);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      // 登录成功，跳转到首页
      router.push('/dashboard/user');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='border-slate-700 bg-slate-800/50 backdrop-blur-sm'>
      <CardHeader className='space-y-1 text-center'>
        <CardTitle className='text-2xl font-bold text-white'>登录</CardTitle>
        <CardDescription className='text-slate-400'>
          输入您的账号信息登录系统
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* 错误提示 */}
          {error && (
            <div className='rounded-md bg-red-500/10 p-3 text-sm text-red-400'>
              {error}
            </div>
          )}

          {/* 用户名 */}
          <div className='space-y-2'>
            <Label htmlFor='username' className='text-slate-200'>
              用户名
            </Label>
            <Input
              id='username'
              type='text'
              placeholder='请输入用户名'
              className='border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500'
              {...register('username', {
                required: '请输入用户名'
              })}
            />
            {errors.username && (
              <p className='text-sm text-red-400'>{errors.username.message}</p>
            )}
          </div>

          {/* 密码 */}
          <div className='space-y-2'>
            <Label htmlFor='password' className='text-slate-200'>
              密码
            </Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='请输入密码'
                className='border-slate-600 bg-slate-700/50 pr-10 text-white placeholder:text-slate-500'
                {...register('password', {
                  required: '请输入密码'
                })}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-300'
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </button>
            </div>
            {errors.password && (
              <p className='text-sm text-red-400'>{errors.password.message}</p>
            )}
          </div>

          {/* 记住密码 */}
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='remember'
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              className='border-slate-500 data-[state=checked]:bg-blue-600'
            />
            <Label
              htmlFor='remember'
              className='cursor-pointer text-sm text-slate-300'
            >
              记住用户名
            </Label>
          </div>

          {/* 登录按钮 */}
          <Button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                登录中...
              </>
            ) : (
              '登录'
            )}
          </Button>

          {/* 注册链接 */}
          <div className='text-center text-sm text-slate-400'>
            还没有账号？{' '}
            <Link
              href='/register'
              className='text-blue-400 hover:text-blue-300 hover:underline'
            >
              立即注册
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
