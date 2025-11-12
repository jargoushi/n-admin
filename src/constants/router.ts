import { NavItem } from '@/types/nav';
import {
  CircleUserRound,
  SquareTerminal,
  Settings,
  ScrollText,
  Users,
  Shield,
  Key
} from 'lucide-react';

// 系统导航列表
export const navList: NavItem[] = [
  {
    title: '工作台',
    url: '/dashboard/overview',
    icon: SquareTerminal,
    isActive: false,
    items: []
  },
  {
    title: '账号管理',
    url: '#',
    icon: CircleUserRound,
    isActive: false,
    items: [
      {
        title: '用户管理',
        url: '/dashboard/account/user',
        icon: Users
      },
      {
        title: '角色管理',
        url: '/dashboard/account/role',
        icon: Shield
      },
      {
        title: '权限管理',
        url: '/dashboard/account/permission',
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
        icon: ScrollText
      },
      {
        title: '激活码管理',
        url: '/dashboard/activation',
        icon: ScrollText
      }
    ]
  }
];
