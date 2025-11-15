'use client'

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarContent
} from '@heroui/react'
import { LogOut, UserCog } from 'lucide-react'

export default function AppProfile() {
  return (
    <NavbarContent as="div" justify="end">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar
              isBordered
              radius="sm"
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
            <div className="flex flex-col justify-center">
              <p className="font-semibold text-sm leading-none">Edison</p>
              <p className="text-gray-500 text-xs">zoey@example.com</p>
            </div>
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem
            key="settings"
            startContent={<UserCog size={24} />}
            description="Create a new file"
          >
            My Settings
          </DropdownItem>
          <DropdownItem key="logout" color="danger" startContent={<LogOut size={18} />}>
            退出登录
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarContent>
  )
}
