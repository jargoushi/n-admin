'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  BadgeCheck,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Settings
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/lib/utils';
import { AuthApiService } from '@/service/api/auth.api';
import { UserApiService } from '@/service/api/user.api';
import type { UserProfile } from '@/app/dashboard/auth/types';
import type { UserUpdateRequest } from '@/app/dashboard/user/types';
import { SettingsDialog } from '@/app/dashboard/settings/components/SettingsDialog';

interface PasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export function NavUser() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  // 用户信息表单
  const profileForm = useForm<UserUpdateRequest>({
    defaultValues: { username: '', phone: '', email: '' }
  });

  // 密码表单
  const passwordForm = useForm<PasswordFormData>({
    defaultValues: { newPassword: '', confirmPassword: '' }
  });

  const newPassword = passwordForm.watch('newPassword');

  // 获取用户信息
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await AuthApiService.getProfile();
        setUser(profile);
      } catch {
        // 未登录或获取失败
      }
    };
    fetchProfile();
  }, []);

  const displayUser = user || { id: 0, username: '游客', email: '未登录' };

  // 打开账号设置弹窗
  const openProfileDialog = () => {
    profileForm.reset({
      username: user?.username || '',
      phone: user?.phone || '',
      email: user?.email || ''
    });
    setProfileDialogOpen(true);
  };

  // 更新用户信息
  const handleUpdateProfile = async (data: UserUpdateRequest) => {
    if (!user) return;
    setIsUpdating(true);
    try {
      await UserApiService.update(user.id, data);
      toast.success('更新成功');
      const newProfile = await AuthApiService.getProfile();
      setUser(newProfile);
      setProfileDialogOpen(false);
    } catch (error) {
      console.error('更新失败:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // 修改密码
  const handleChangePassword = async (data: PasswordFormData) => {
    setIsUpdating(true);
    try {
      await AuthApiService.changePassword(data.newPassword);
      toast.success('密码修改成功');
      passwordForm.reset();
      setPasswordDialogOpen(false);
    } catch (error) {
      console.error('修改密码失败:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // 退出登录
  const handleLogout = async () => {
    try {
      await AuthApiService.logout();
      toast.success('退出登录成功');
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='relative h-9 w-9 rounded-full'
            title={displayUser.username}
          >
            <Avatar className='border-border/50 hover:border-primary/50 h-9 w-9 border transition-colors'>
              <AvatarImage
                src='/avatars/default.jpg'
                alt={displayUser.username}
              />
              <AvatarFallback className='bg-primary/10 text-primary font-medium'>
                {getInitials(displayUser.username)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' sideOffset={8}>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm leading-none font-medium'>
                {displayUser.username}
              </p>
              <p className='text-muted-foreground text-xs leading-none'>
                {displayUser.email || '未设置邮箱'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={openProfileDialog}
              className='cursor-pointer'
            >
              <BadgeCheck className='mr-2 h-4 w-4' />
              <span>账号设置</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setPasswordDialogOpen(true)}
              className='cursor-pointer'
            >
              <Lock className='mr-2 h-4 w-4' />
              <span>修改密码</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSettingsDialogOpen(true)}
              className='cursor-pointer'
            >
              <Settings className='mr-2 h-4 w-4' />
              <span>系统设置</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className='cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/50'
          >
            <LogOut className='mr-2 h-4 w-4' />
            <span>退出登录</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 账号设置弹窗 */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>账号设置</DialogTitle>
            <DialogDescription>更新您的个人信息</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={profileForm.handleSubmit(handleUpdateProfile)}
            className='space-y-4'
          >
            <div className='space-y-2'>
              <Label htmlFor='username'>用户名</Label>
              <Input
                id='username'
                placeholder='2-50位，字母、数字、下划线'
                {...profileForm.register('username', {
                  minLength: { value: 2, message: '用户名至少2位' },
                  maxLength: { value: 50, message: '用户名最多50位' },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: '只能包含字母、数字和下划线'
                  }
                })}
              />
              {profileForm.formState.errors.username && (
                <p className='text-sm text-red-500'>
                  {profileForm.formState.errors.username.message}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='phone'>手机号</Label>
              <Input
                id='phone'
                placeholder='请输入手机号'
                {...profileForm.register('phone', {
                  pattern: {
                    value: /^1[3-9]\d{9}$/,
                    message: '请输入正确的手机号'
                  }
                })}
              />
              {profileForm.formState.errors.phone && (
                <p className='text-sm text-red-500'>
                  {profileForm.formState.errors.phone.message}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>邮箱</Label>
              <Input
                id='email'
                type='email'
                placeholder='请输入邮箱'
                {...profileForm.register('email', {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: '请输入正确的邮箱'
                  }
                })}
              />
              {profileForm.formState.errors.email && (
                <p className='text-sm text-red-500'>
                  {profileForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setProfileDialogOpen(false)}
              >
                取消
              </Button>
              <Button type='submit' disabled={isUpdating}>
                {isUpdating ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : null}
                保存
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 修改密码弹窗 */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>修改密码</DialogTitle>
            <DialogDescription>
              密码需8-20位，包含大小写字母和数字
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={passwordForm.handleSubmit(handleChangePassword)}
            className='space-y-4'
          >
            <div className='space-y-2'>
              <Label htmlFor='newPassword'>新密码</Label>
              <div className='relative'>
                <Input
                  id='newPassword'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='8-20位，包含大小写字母和数字'
                  className='pr-10'
                  {...passwordForm.register('newPassword', {
                    required: '请输入新密码',
                    minLength: { value: 8, message: '密码至少8位' },
                    maxLength: { value: 20, message: '密码最多20位' },
                    validate: (v) => {
                      if (
                        !/[A-Z]/.test(v) ||
                        !/[a-z]/.test(v) ||
                        !/[0-9]/.test(v)
                      ) {
                        return '必须包含大写字母、小写字母和数字';
                      }
                      return true;
                    }
                  })}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2'
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {passwordForm.formState.errors.newPassword && (
                <p className='text-sm text-red-500'>
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>确认密码</Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='请再次输入新密码'
                  className='pr-10'
                  {...passwordForm.register('confirmPassword', {
                    required: '请确认密码',
                    validate: (v) => v === newPassword || '两次输入的密码不一致'
                  })}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {passwordForm.formState.errors.confirmPassword && (
                <p className='text-sm text-red-500'>
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setPasswordDialogOpen(false)}
              >
                取消
              </Button>
              <Button type='submit' disabled={isUpdating}>
                {isUpdating ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : null}
                确认修改
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 系统设置弹窗 */}
      <SettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
      />
    </>
  );
}
