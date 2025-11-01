'use client'

import { useSidebar } from '@/hooks/useSidebar'
import { MenuItem } from '.'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'
import { ChevronDown } from 'lucide-react'

export function SidebarMenuItem({ menu }: { menu: MenuItem }) {
  const { isCollapsed } = useSidebar()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // 检查当前菜单项或其子菜单是否激活
  const isActive = pathname === menu.path
  const hasActiveChild = menu.children?.some(child => pathname === child.path)

  // 如果有子菜单
  if (menu.children) {
    // 收缩状态：使用 Dropdown
    if (isCollapsed) {
      return (
        <Dropdown placement="right">
          <DropdownTrigger>
            <button
              className={`
                w-full flex items-center justify-center p-2 hover:bg-gray-100
                ${hasActiveChild ? 'bg-gray-200' : ''}
              `}
            >
              {menu.icon}
            </button>
          </DropdownTrigger>
          <DropdownMenu>
            {menu.children.map(child => (
              <DropdownItem key={child.id}>
                <Link href={child.path || '#'} className="flex items-center gap-2">
                  {child.icon}
                  <span>{child.label}</span>
                </Link>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      )
    }

    // 展开状态：使用手风琴
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center gap-3 px-6 py-2 cursor-pointer hover:bg-gray-100 ${hasActiveChild ? 'bg-gray-100' : ''}`}
        >
          {menu.icon}
          <span className="flex-1 text-left">{menu.label}</span>
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="bg-gray-50">
            {menu.children.map(child => {
              const isChildActive = pathname === child.path
              return (
                <Link
                  key={child.id}
                  href={child.path || '#'}
                  className={`flex items-center gap-3 px-6 py-2 pl-12 hover:bg-gray-200 ${isChildActive ? 'bg-gray-200 border-l-4 border-blue-500' : ''}`}
                >
                  {child.icon}
                  <span>{child.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // 普通菜单项
  const content = (
    <>
      {menu.icon}
      {!isCollapsed && <span>{menu.label}</span>}
    </>
  )

  return (
    <Link
      href={menu.path || '#'}
      className={`
        flex items-center gap-3 py-2 hover:bg-gray-200 transition-colors
        ${isCollapsed ? 'justify-center' : 'px-6'}
        ${isActive ? 'bg-gray-200 border-l-4 border-blue-500' : ''}
      `}
    >
      {content}
    </Link>
  )
}
