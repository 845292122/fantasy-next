'use client'

import { useSidebar } from '@/hooks/useSidebar'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from '@heroui/react'
import { LogOut, User } from 'lucide-react'

export function SidebarFooter() {
  const { isCollapsed } = useSidebar()

  return (
    <footer className="border-t border-gray-200 p-2">
      <Dropdown placement={isCollapsed ? 'right' : 'top'}>
        <DropdownTrigger>
          <button
            className={`w-full flex items-center gap-3 p-2 cursor-pointer rounded ${isCollapsed ? 'justify-center' : ''}`}
          >
            <div className="shrink-0">
              <Avatar size="sm" src="/avatar.jpg" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 text-left text-sm">
                <div className="font-semibold">张三</div>
                <div className="text-gray-400 text-xs">admin@example.com</div>
              </div>
            )}
          </button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem key="profile" startContent={<User size={16} />}>
            个人资料
          </DropdownItem>
          <DropdownItem key="logout" color="danger" startContent={<LogOut size={16} />}>
            退出登录
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </footer>
  )
}
