'use client'

import Sidebar, { getPageTitle } from '@/components/Sidebar'
import { usePathname } from 'next/navigation'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {pageTitle && (
          <div className="flex items-center gap-3 px-7 pt-5 pb-4">
            <div className="w-1 h-6 bg-blue-500 rounded"></div>
            <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
          </div>
        )}
        <div className="flex-1 overflow-auto px-7">{children}</div>
      </div>
    </div>
  )
}
