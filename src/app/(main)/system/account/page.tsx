'use client'

import PageContainer from '@/components/PageContainer'
import { addToast, Button } from '@heroui/react'
import { Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import AccountTable from './AccountTable'
import SearchInput from '@/components/SearchInput'
import DataFormModal from '@/components/DataForm/DataFormModal'
import { FormField } from '@/components/DataForm'
import * as Yup from 'yup'
import {
  createAccount,
  updateAccount,
  CreateAccountInput,
  UpdateAccountInput,
  AccountWithProfile
} from '@/actions/account.actions'
import { useAccounts } from '@/hooks/swr/useAccounts'
import { BooleanUtils } from '@/utils'

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<AccountWithProfile | null>(null)
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)

  // 使用 SWR 获取数据
  const { accounts, total, isLoading, mutate } = useAccounts({ keyword, page, pageSize: 10 })

  // 表单字段配置（扁平化，Account 和 Profile 字段在同一级）
  const formFields: FormField[] = [
    // Account 字段
    {
      name: 'email',
      label: '邮箱',
      type: 'email',
      placeholder: '请输入邮箱'
    },
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
      name: 'isActive',
      label: '状态',
      type: 'select',
      options: [
        { label: '启用', value: true },
        { label: '禁用', value: false }
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
      name: 'domain',
      label: '域名',
      type: 'text',
      placeholder: '请输入域名'
    },
    {
      name: 'wechatID',
      label: '微信ID',
      type: 'text',
      placeholder: '请输入微信号'
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
      email: values.email,
      phone: values.phone,
      passwordHash: values.passwordHash,
      role: Number(values.role),
      isActive: BooleanUtils.toBoolean(values.isActive),

      // Profile 字段
      contact: values.contact,
      shopName: values.shopName,
      address: values.address,
      creditCode: values.creditCode,
      wechatID: values.wechatID,
      remark: values.remark
    }

    const result = await createAccount(input)
    if (result.success) {
      mutate() // 刷新列表
      addToast({ color: 'success', title: '创建成功' })
    }
  }

  // 打开编辑弹窗
  const handleEdit = (account: AccountWithProfile) => {
    console.log(account)
    setEditingAccount(account)
    setIsEditModalOpen(true)
  }

  // 更新账户
  const handleUpdate = async (values: any) => {
    if (!editingAccount) return

    const input: UpdateAccountInput = {
      id: editingAccount.id,
      // Account 字段
      email: values.email,
      phone: values.phone,
      role: Number(values.role),
      isActive: BooleanUtils.toBoolean(values.isActive),

      // Profile 字段
      contact: values.contact,
      shopName: values.shopName,
      address: values.address,
      creditCode: values.creditCode,
      remark: values.remark
    }

    const result = await updateAccount(input)
    if (result.success) {
      await mutate() // 刷新列表
      // 从最新数据中找到更新后的账号
      const updatedAccount = accounts.find(acc => acc.id === editingAccount.id)
      if (updatedAccount) {
        setEditingAccount(updatedAccount)
      }
      addToast({ color: 'success', title: '更新成功' })
    }
  }

  return (
    <PageContainer
      actions={
        <Button
          color="primary"
          startContent={<Plus size={16} />}
          onPress={() => setIsModalOpen(true)}
        >
          新增账户
        </Button>
      }
    >
      <div className="mb-3 mt-2">
        <SearchInput onSearch={handleSearch} />
      </div>
      <AccountTable accounts={accounts} loading={isLoading} onEdit={handleEdit} />

      {/* 新增 Modal */}
      <DataFormModal
        key={isModalOpen ? 'create-modal-open' : 'create-modal-closed'}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}
        title="新增账户"
        size="2xl"
        fields={formFields}
        initialValues={{
          phone: '',
          passwordHash: '',
          role: 2,
          isActive: true,
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

      {/* 编辑 Modal */}
      {editingAccount && (
        <DataFormModal
          key={`edit-modal-${editingAccount.id}-${isEditModalOpen}`}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingAccount(null)
          }}
          title="编辑账户"
          size="2xl"
          fields={formFields.filter(f => f.name !== 'passwordHash')} // 编辑时不显示密码字段
          initialValues={{
            email: editingAccount?.email || '',
            phone: editingAccount.phone || '',
            role: editingAccount.role || 2,
            isActive: BooleanUtils.toBoolean(editingAccount.isActive),
            contact: editingAccount.Profile?.contact || '',
            shopName: editingAccount.Profile?.shopName || '',
            address: editingAccount.Profile?.address || '',
            creditCode: editingAccount.Profile?.creditCode || '',
            remark: editingAccount.Profile?.remark || ''
          }}
          validationSchema={validationSchema.omit(['passwordHash'])}
          onSubmit={handleUpdate}
        />
      )}
    </PageContainer>
  )
}
