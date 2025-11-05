'use client'

import PageContainer from '@/components/PageContainer'
import { Button } from '@heroui/react'
import { Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import AccountTable from './AccountTable'
import SearchInput from '@/components/SearchInput'
import DataFormModal from '@/components/DataForm/DataFormModal'
import { FormField } from '@/components/DataForm'
import * as Yup from 'yup'
import { createAccount, CreateAccountInput } from '@/actions/account.actions'
import { useAccounts } from '@/hooks/swr/useAccounts'

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

// 验证规则
const validationSchema = Yup.object({
  phone: Yup.string()
    .required('手机号必填')
    .matches(/^1[3-9]\d{9}$/, '手机号格式不正确'),
  passwordHash: Yup.string().required('密码必填').min(6, '密码至少6个字符'),
  role: Yup.number().required('角色必选'),
  email: Yup.string().email('邮箱格式不正确')
})

export default function AccountPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)

  // 使用 SWR 获取数据
  const { accounts, total, isLoading, mutate } = useAccounts({ keyword, page, pageSize: 10 })

  // 表单字段配置（扁平化，Account 和 Profile 字段在同一级）
  const formFields: FormField[] = [
    // Account 字段
    {
      name: 'phone',
      label: '手机号',
      type: 'text',
      placeholder: '请输入手机号',
      required: true
    },
    {
      name: 'passwordHash',
      label: '密码',
      type: 'password',
      placeholder: '请输入密码',
      required: true
    },
    {
      name: 'role',
      label: '角色',
      type: 'select',
      options: [
        { label: '管理员', value: 1 },
        { label: '普通用户', value: 2 }
      ],
      required: true
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    },

    // Profile 字段（同级）
    {
      name: 'contact',
      label: '联系人',
      type: 'text',
      placeholder: '请输入联系人'
    },
    {
      name: 'shopName',
      label: '店铺名称',
      type: 'text',
      placeholder: '请输入店铺名称'
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'email',
      placeholder: '请输入邮箱'
    },
    {
      name: 'address',
      label: '地址',
      type: 'text',
      placeholder: '请输入地址'
    },
    {
      name: 'creditCode',
      label: '统一社会信用代码',
      type: 'text',
      placeholder: '请输入统一社会信用代码'
    },
    {
      name: 'remark',
      label: '备注',
      type: 'textarea',
      placeholder: '请输入备注',
      rows: 3
    }
  ]

  const handleSearch = useCallback((keyword: string) => {
    console.log('搜索关键词:', keyword)
    // TODO: 调用后台 API 查询
    setTimeout(() => {
      // 模拟搜索
      const filtered = mockAccounts.filter(
        account => account.username.includes(keyword) || account.email.includes(keyword)
      )
    }, 500)
  }, [])

  // 创建账户
  const handleCreate = async (values: any) => {
    const input: CreateAccountInput = {
      // Account 字段
      phone: values.phone,
      passwordHash: values.passwordHash,
      role: values.role,
      status: values.status || 1,

      // Profile 字段
      contact: values.contact,
      shopName: values.shopName,
      email: values.email,
      address: values.address,
      creditCode: values.creditCode,
      remark: values.remark
    }

    const result = await createAccount(input)
    if (result.success) {
      mutate() // 刷新列表
      // Modal 会自动关闭，不需要手动 setIsModalOpen(false)
    }
  }

  const handleAdd = () => {}

  return (
    <PageContainer
      actions={
        <Button
          color="primary"
          startContent={<Plus size={16} />}
          onPress={() => setIsModalOpen(true)}
        >
          新增账号
        </Button>
      }
    >
      <div className="mb-3 mt-2">
        <SearchInput onSearch={handleSearch} />
      </div>
      <AccountTable accounts={accounts} loading={isLoading} />
      <DataFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}
        title="编辑账户"
        size="2xl"
        fields={formFields}
        initialValues={{
          phone: '',
          passwordHash: '',
          role: 2,
          status: 1,
          contact: '',
          shopName: '',
          email: '',
          address: '',
          creditCode: '',
          remark: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleCreate}
      />
    </PageContainer>
  )
}
