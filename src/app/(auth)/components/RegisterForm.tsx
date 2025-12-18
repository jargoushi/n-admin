/**
 * 注册表单组件
 *
 * @description
 * 用户注册表单，需要用户名、密码和激活码
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { UserApiService } from '@/service/api/user.api';
import type { UserRegisterRequest } from '@/app/dashboard/user/types';

interface RegisterFormData extends UserRegisterRequest {
  confirmPassword: string;
}

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormData>({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      activation_code: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await UserApiService.register({
        username: data.username,
        password: data.password,
        activation_code: data.activation_code
      });

      toast.success('注册成功，请登录');
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='border-slate-700 bg-slate-800/50 backdrop-blur-sm'>
      <CardHeader className='space-y-1 text-center'>
        <CardTitle className='text-2xl font-bold text-white'>注册</CardTitle>
        <CardDescription className='text-slate-400'>
          创建您的账号
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
              placeholder='2-50位，字母、数字、下划线'
              className='border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500'
              {...register('username', {
                required: '请输入用户名',
                minLength: { value: 2, message: '用户名至少2位' },
                maxLength: { value: 50, message: '用户名最多50位' },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: '只能包含字母、数字和下划线'
                }
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
                placeholder='8-20位，包含大小写字母和数字'
                className='border-slate-600 bg-slate-700/50 pr-10 text-white placeholder:text-slate-500'
                {...register('password', {
                  required: '请输入密码',
                  minLength: { value: 8, message: '密码至少8位' },
                  maxLength: { value: 20, message: '密码最多20位' },
                  validate: (value) => {
                    const hasUpper = /[A-Z]/.test(value);
                    const hasLower = /[a-z]/.test(value);
                    const hasDigit = /[0-9]/.test(value);
                    if (!hasUpper || !hasLower || !hasDigit) {
                      return '必须包含大写字母、小写字母和数字';
                    }
                    return true;
                  }
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

          {/* 确认密码 */}
          <div className='space-y-2'>
            <Label htmlFor='confirmPassword' className='text-slate-200'>
              确认密码
            </Label>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='请再次输入密码'
                className='border-slate-600 bg-slate-700/50 pr-10 text-white placeholder:text-slate-500'
                {...register('confirmPassword', {
                  required: '请确认密码',
                  validate: (value) =>
                    value === password || '两次输入的密码不一致'
                })}
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-300'
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='text-sm text-red-400'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* 激活码 */}
          <div className='space-y-2'>
            <Label htmlFor='activation_code' className='text-slate-200'>
              激活码
            </Label>
            <Input
              id='activation_code'
              type='text'
              placeholder='请输入激活码'
              className='border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500'
              {...register('activation_code', {
                required: '请输入激活码'
              })}
            />
            {errors.activation_code && (
              <p className='text-sm text-red-400'>
                {errors.activation_code.message}
              </p>
            )}
          </div>

          {/* 注册按钮 */}
          <Button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                注册中...
              </>
            ) : (
              '注册'
            )}
          </Button>

          {/* 登录链接 */}
          <div className='text-center text-sm text-slate-400'>
            已有账号？{' '}
            <Link
              href='/login'
              className='text-blue-400 hover:text-blue-300 hover:underline'
            >
              立即登录
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
