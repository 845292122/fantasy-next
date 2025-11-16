import { Building2, Users, Zap, Shield } from 'lucide-react'
import { AcmeLogo } from '@/components/AppNavbar'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-screen bg-linear-to-b from-slate-50 via-blue-50 to-indigo-100">
      <div className="hidden lg:flex w-1/2 p-12 justify-end items-center">
        <div className="max-w-md flex flex-col">
          <header className="flex items-center mb-7">
            <AcmeLogo />
            <h1 className="font-bold text-xl">后台管理系统</h1>
          </header>

          <div className="space-y-8">
            <div className="flex gap-4">
              <Building2 className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <h3 className="font-bold text-sm mb-2">多租户架构</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  支持多个企业独立运营，数据完全隔离，每个租户拥有独立的管理空间和配置选项。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Users className="w-6 h-6 text-purple-600 shrink-0" />
              <div>
                <h3 className="font-bold text-sm mb-2">灵活的权限管理</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  基于角色的访问控制，细粒度的权限配置，让团队协作更加高效安全。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Zap className="w-6 h-6 text-orange-600 shrink-0" />
              <div>
                <h3 className="font-bold text-sm mb-2">开箱即用</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  快速部署，无需复杂配置，提供完善的 API 接口和文档，助力业务快速上线。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Shield className="w-6 h-6 text-green-600 shrink-0" />
              <div>
                <h3 className="font-bold text-sm mb-2">安全可靠</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  企业级安全防护，数据加密存储，定期备份，确保您的业务数据万无一失。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start">
        {children}
      </div>
    </div>
  )
}
