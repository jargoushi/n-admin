import { NavItem } from '@/types/nav';
import {
  Settings,
  Activity,
  Eye,
  ListChecks,
  Ticket,
  Users
} from 'lucide-react';

// 系统导航列表
export const navList: NavItem[] = [
  {
    title: '数据监控',
    url: '#',
    icon: Activity,
    isActive: false,
    items: [
      {
        title: '监控配置',
        url: '/dashboard/monitor',
        icon: Eye
      },
      {
        title: '任务管理',
        url: '/dashboard/task',
        icon: ListChecks
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
        title: '激活码管理',
        url: '/dashboard/activation',
        icon: Ticket
      },
      {
        title: '用户管理',
        url: '/dashboard/user',
        icon: Users
      }
    ]
  }
];
