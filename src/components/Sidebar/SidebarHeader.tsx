'use client'

import { useSidebar } from '@/hooks/useSidebar'
import Image from 'next/image'
import { Button } from '@heroui/react'
import { Menu, X } from 'lucide-react'

export default function SidebarHeader() {
  const { isCollapsed, toggle } = useSidebar()

  return (
    <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200">
      {!isCollapsed && (
        <>
          <div className="flex items-center gap-3">
            <Image src="/vercel.svg" alt="Logo" width={32} height={32} />
            <h1 className="font-bold text-lg">后台管理系统</h1>
          </div>
          <Button isIconOnly variant="light" size="sm" onPress={toggle} className="text-black">
            <X size={20} />
          </Button>
        </>
      )}

      {isCollapsed && (
        <Button isIconOnly variant="light" size="sm" onPress={toggle} className="text-black">
          <Menu size={20} />
        </Button>
      )}
    </header>
  )
}
