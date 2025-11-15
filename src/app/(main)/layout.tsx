'use client'

import AppNavbar from '@/components/AppNavbar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      <div className="sticky top-0 z-10">
        <AppNavbar />
      </div>
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  )
}
