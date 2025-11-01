'use client'

import { useSidebar } from '@/hooks/useSidebar'
import { FileText, Home, Users } from 'lucide-react'
import React from 'react'
import SidebarHeader from './SidebarHeader'
import { SidebarMenu } from './SidebarMenu'
import { SidebarFooter } from './SidebarFooter'

export interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  path?: string
  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  {
    id: '1',
    label: '首页',
    icon: <Home size={20} />,
    path: '/home'
  },
  {
    id: '2',
    label: '系统管理',
    icon: <Users size={20} />,
    children: [
      { id: '2-1', label: '账号管理', icon: <Users size={16} />, path: '/system/account' },
      { id: '2-2', label: '日志管理', icon: <FileText size={16} />, path: '/system/log' }
    ]
  }
]

// 根据路径获取页面标题
export function getPageTitle(pathname: string): string | null {
  for (const item of menuItems) {
    // 检查顶级菜单
    if (item.path === pathname) {
      return item.path === '/home' ? null : item.label
    }
    // 检查子菜单
    if (item.children) {
      const child = item.children.find(c => c.path === pathname)
      if (child) {
        return child.label
      }
    }
  }
  return null
}

export default function Sidebar() {
  const { isCollapsed } = useSidebar()

  return (
    <aside
      className={`h-screen bg-gray-50 text-gray-800 transition-all duration-300 flex flex-col border-r border-gray-200 ${isCollapsed ? 'w-16' : 'w-56'}`}
    >
      <SidebarHeader />
      <SidebarMenu menus={menuItems} />
      <SidebarFooter />
    </aside>
  )
}
