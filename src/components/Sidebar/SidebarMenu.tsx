'use client'

import { MenuItem } from '.'
import { SidebarMenuItem } from './SidebarMenuItem'

export function SidebarMenu({ menus }: { menus: MenuItem[] }) {
  return (
    <nav className="flex-1 overflow-y-auto py-4">
      {menus.map(menu => (
        <SidebarMenuItem key={menu.id} menu={menu} />
      ))}
    </nav>
  )
}
