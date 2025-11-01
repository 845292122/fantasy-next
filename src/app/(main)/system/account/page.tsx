'use client'

import PageContainer from '@/components/PageContainer'
import { Button } from '@heroui/react'
import { Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import AccountTable from './AccountTable'
import SearchInput from '@/components/SearchInput'

// 模拟数据
const mockAccounts = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: '管理员',
    status: 'active' as const,
    createdAt: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    role: '普通用户',
    status: 'active' as const,
    createdAt: '2024-01-02 14:30:00'
  },
  {
    id: 3,
    username: 'user2',
    email: 'user2@example.com',
    role: '普通用户',
    status: 'inactive' as const,
    createdAt: '2024-01-03 09:15:00'
  }
]

export default function AccountPage() {
  const [accounts, setAccounts] = useState(mockAccounts)
  const [loading, setLoading] = useState(false)

  const handleSearch = useCallback((keyword: string) => {
    console.log('搜索关键词:', keyword)
    // TODO: 调用后台 API 查询
    setLoading(true)
    setTimeout(() => {
      // 模拟搜索
      const filtered = mockAccounts.filter(
        account => account.username.includes(keyword) || account.email.includes(keyword)
      )
      setAccounts(filtered)
      setLoading(false)
    }, 500)
  }, [])

  const handleAdd = () => {
    console.log('新增账号')
    // TODO: 打开新增弹窗
  }

  return (
    <PageContainer
      actions={
        <Button color="primary" startContent={<Plus size={16} />} onPress={handleAdd}>
          新增账号
        </Button>
      }
    >
      <div className="mb-3 mt-2">
        <SearchInput onSearch={handleSearch} />
      </div>
      <AccountTable accounts={accounts} loading={loading} />
    </PageContainer>
  )
}
