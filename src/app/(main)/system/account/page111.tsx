'use client'

import { useState } from 'react'
import { Button } from '@heroui/react'
import { Plus } from 'lucide-react'
import DataFormModal from '@/components/DataForm/DataFormModal'
import { FormField } from '@/components/DataForm/types'
import { useAccounts } from '@/hooks/swr/useAccounts'
import {
  createAccount,
  updateAccount,
  deleteAccount,
  type CreateAccountInput,
  type UpdateAccountInput
} from '@/actions/account.actions'
import * as Yup from 'yup'

export default function AccountManagePage() {
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<any>(null)

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

  // 验证规则
  const validationSchema = Yup.object({
    phone: Yup.string()
      .required('手机号必填')
      .matches(/^1[3-9]\d{9}$/, '手机号格式不正确'),
    passwordHash: Yup.string().required('密码必填').min(6, '密码至少6个字符'),
    role: Yup.number().required('角色必选'),
    email: Yup.string().email('邮箱格式不正确')
  })

  // 搜索处理
  const handleSearch = (keyword: string) => {
    setKeyword(keyword)
    setPage(1)
  }

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
      setIsCreateModalOpen(false)
    }
  }

  // 编辑账户
  const handleEdit = (account: any) => {
    // 将 Account 和 Profile 扁平化到同一级
    const flatData = {
      id: account.id,
      // Account 字段
      phone: account.phone,
      role: account.role,
      status: account.status,
      avatar: account.avatar,
      isPremium: account.isPremium,

      // Profile 字段
      contact: account.Profile?.contact,
      shopName: account.Profile?.shopName,
      email: account.Profile?.email,
      address: account.Profile?.address,
      creditCode: account.Profile?.creditCode,
      domain: account.Profile?.domain,
      wechatID: account.Profile?.wechatID,
      remark: account.Profile?.remark
    }

    setEditingAccount(flatData)
    setIsEditModalOpen(true)
  }

  // 更新账户
  const handleUpdate = async (values: any) => {
    const input: UpdateAccountInput = {
      id: editingAccount.id,
      // Account 字段
      phone: values.phone,
      role: values.role,
      status: values.status,

      // Profile 字段
      contact: values.contact,
      shopName: values.shopName,
      email: values.email,
      address: values.address,
      creditCode: values.creditCode,
      remark: values.remark
    }

    const result = await updateAccount(input)
    if (result.success) {
      mutate() // 刷新列表
      setIsEditModalOpen(false)
      setEditingAccount(null)
    }
  }

  // 删除账户
  const handleDelete = async (id: number) => {
    if (confirm('确定要删除该账户吗？关联的 Profile 也会被删除。')) {
      await deleteAccount(id)
      mutate() // 刷新列表
    }
  }

  return (
    <div className="space-y-4">
      {/* 搜索和操作栏 */}
      <div className="flex justify-between items-center">
        <div>搜索功能区</div>
        <Button
          color="primary"
          startContent={<Plus size={16} />}
          onPress={() => setIsCreateModalOpen(true)}
        >
          新增账户
        </Button>
      </div>
      {/* 这里放置表格组件 */}
      <div>
        {isLoading ? '加载中...' : `共 ${total} 条数据`}
        {/* AccountTable 组件 */}
      </div>

      {/* 新增表单 */}
      <DataFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="新增账户"
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

      {/* 编辑表单 */}
      {editingAccount && (
        <DataFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingAccount(null)
          }}
          title="编辑账户"
          size="2xl"
          fields={formFields.filter(f => f.name !== 'passwordHash')} // 编辑时不显示密码
          initialValues={editingAccount}
          validationSchema={validationSchema.omit(['passwordHash'])}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  )
}
