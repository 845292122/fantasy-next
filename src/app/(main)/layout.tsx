export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside>侧边栏</aside>
      <div>{children}</div>
    </div>
  )
}
