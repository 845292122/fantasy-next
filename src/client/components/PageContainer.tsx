'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface PageContainerProps {
  children: React.ReactNode
  actions?: ReactNode
}

export default function PageContainer({ children, actions }: PageContainerProps) {
  const pathname = usePathname()

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-7 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-blue-500 rounded"></div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="flex-1 overflow-auto px-7">{children}</div>
    </div>
  )
}
