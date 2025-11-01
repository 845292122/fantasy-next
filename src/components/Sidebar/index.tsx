'use client'

import { useSidebar } from '@/hooks/useSidebar'
import { FileText, Home, Settings, Users } from 'lucide-react'
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

const menuItems: MenuItem[] = [
  {
    id: '1',
    label: '首页',
    icon: <Home size={20} />,
    path: '/dashboard'
  },
  {
    id: '2',
    label: '用户管理',
    icon: <Users size={20} />,
    children: [
      { id: '2-1', label: '账号列表', icon: <Users size={16} />, path: '/accounts' },
      { id: '2-2', label: '资料管理', icon: <FileText size={16} />, path: '/profiles' }
    ]
  },
  {
    id: '3',
    label: '设置',
    icon: <Settings size={20} />,
    path: '/settings'
  }
]

export default function Sidebar() {
  const { isCollapsed } = useSidebar()

  return (
    <aside
      className={`h-screen bg-gray-50 text-gray-800 transition-all duration-300 flex flex-col border-r border-gray-200 ${isCollapsed ? 'w-16' : 'w-64'}`}
    >
      <SidebarHeader />
      <SidebarMenu menus={menuItems} />
      <SidebarFooter />
    </aside>
  )
}
