'use client'

import { ChevronDown, FileText, Home, Users } from 'lucide-react'
import React from 'react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarContent,
  NavbarItem
} from '@heroui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  path?: string
  children?: MenuItem[]
}

export const menus: MenuItem[] = [
  {
    id: '1',
    label: '首页',
    icon: <Home size={16} />,
    path: '/home'
  },
  {
    id: '2',
    label: '系统管理',
    icon: <Users size={16} />,
    children: [
      { id: '2-1', label: '账号管理', icon: <Users size={16} />, path: '/system/account' },
      { id: '2-2', label: '日志管理', icon: <FileText size={16} />, path: '/system/log' }
    ]
  }
]

export default function AppNavbarMenu() {
  const pathname = usePathname()

  return (
    <NavbarContent className="hidden sm:flex gap-4" justify="center">
      {menus.map(menu => {
        const isParentActive = menu.children?.some(child => child.path === pathname)
        if (menu.children) {
          return (
            <Dropdown key={menu.id}>
              <NavbarItem>
                <DropdownTrigger>
                  <Button
                    variant={isParentActive ? 'solid' : 'light'}
                    color={isParentActive ? 'primary' : 'default'}
                    className="gap-1"
                    startContent={menu.icon}
                    endContent={<ChevronDown size={16} />}
                    aria-current={isParentActive ? 'page' : undefined}
                  >
                    {menu.label}
                  </Button>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu aria-label={menu.label} itemClasses={{ base: 'gap-2' }}>
                {menu.children.map(child => {
                  const isActiveChild = child.path === pathname
                  return (
                    <DropdownItem
                      key={child.id}
                      as={Link}
                      href={child.path || '#'}
                      startContent={child.icon}
                      className={isActiveChild ? 'bg-primary text-primary-foreground' : undefined}
                      aria-current={isActiveChild ? 'page' : undefined}
                    >
                      {child.label}
                    </DropdownItem>
                  )
                })}
              </DropdownMenu>
            </Dropdown>
          )
        }
        const isLeafActive = menu.path === pathname
        return (
          <NavbarItem key={menu.id}>
            <Button
              as={Link}
              href={menu.path || '#'}
              className="flex items-center gap-1 text-sm"
              variant={isLeafActive ? 'solid' : 'light'}
              color={isLeafActive ? 'primary' : 'default'}
              aria-current={isLeafActive ? 'page' : undefined}
            >
              {menu.icon}
              {menu.label}
            </Button>
          </NavbarItem>
        )
      })}
    </NavbarContent>
  )
}
