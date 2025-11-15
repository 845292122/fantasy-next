import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-screen">
      <div className="flex-1 bg-[#d3e3fe] flex flex-col py-14 pl-12 select-none">
        <header className="flex items-center">
          <Image src="/vercel.svg" alt="logo" width={22} height={22} />
          <h1 className="font-bold text-xl ml-3">后台管理系统</h1>
        </header>
        <main className="flex-1 overflow-auto flex flex-col justify-center">
          <h2 className="font-bold text-5xl">请登录</h2>
          <span className="font-semibold text-xl mt-5 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            登录后，您将能够访问该应用程序的所有功能。
          </span>
        </main>
        <footer className="border-gray-300 text-sm text-gray-700">
          © 2025 Your Company. All rights reserved.
        </footer>
      </div>
      <div className="flex-1 bg-white flex items-center justify-center px-14">{children}</div>
    </div>
  )
}
