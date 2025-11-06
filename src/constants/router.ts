import { NavItem } from '@/types/nav';
import {
  CircleUserRound,
  SquareTerminal,
  Settings,
  ScrollText,
  Cog,
  Users,
  Shield,
  Key
} from 'lucide-react';

// 业务导航列表
export const businessNavList: NavItem[] = [
  {
    title: '工作台',
    url: '/dashboard/overview',
    icon: SquareTerminal,
    isActive: false,
    description: '工作台',
    items: []
  }
];

// 系统导航列表
export const systemNavList: NavItem[] = [
  {
    title: '账号管理',
    url: '#',
    icon: CircleUserRound,
    isActive: false,
    items: [
      {
        title: '用户管理',
        url: '/dashboard/account/user',
        description: '用户管理',
        icon: Users
      },
      {
        title: '角色管理',
        url: '/dashboard/account/role',
        description: '角色管理',
        icon: Shield
      },
      {
        title: '权限管理',
        url: '/dashboard/account/permission',
        description: '权限管理',
        icon: Key
      }
    ]
  },
  {
    title: '系统管理',
    url: '#',
    icon: Settings,
    isActive: false,
    items: [
      {
        title: '日志管理',
        url: '/dashboard/system/logs',
        icon: ScrollText,
        description: '系统日志审计'
      }
    ]
  }
];

// 保持原有的navList导出以兼容现有代码
export const navList: NavItem[] = [...businessNavList, ...systemNavList];
