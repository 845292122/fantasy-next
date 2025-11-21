'use client'

import { addToast, Button } from '@heroui/react'
import { Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import AccountTable from './AccountTable'
import SearchInput from '@/components/SearchInput'
import DataFormModal from '@/components/DataForm/DataFormModal'
import { FormField } from '@/components/DataForm'
import * as Yup from 'yup'
import { createAccount, updateAccount } from '@/server/actions/account.actions'
import { useAccountList } from '@/swr/account'
import { BooleanUtils } from '@/utils'
import {
  AccountWithProfile,
  CreateAccountInput,
  UpdateAccountInput
} from '@/server/schemas/account.schema'

type ModalMode = 'create' | 'edit'

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

// * 验证规则
const validationSchema = Yup.object({
  phone: Yup.string()
    .required('手机号必填')
    .matches(/^1[3-9]\d{9}$/, '手机号格式不正确'),
  passwordHash: Yup.string().required('密码必填').min(6, '密码至少6个字符'),
  role: Yup.number().required('角色必选'),
  email: Yup.string().email('邮箱格式不正确')
})

// TODO 查询
// TODO 分页功能
// TODO 后端业务校验
// TODO 冻结账户
// TODO 表格宽度、fixed配置
export default function AccountPage() {
  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentAccount, setCurrentAccount] = useState<AccountWithProfile | null>(null)
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)

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

  const isEdit = modalMode === 'edit'
  const modalFields = isEdit ? formFields.filter(f => f.name !== 'passwordHash') : formFields
  const initialValues =
    isEdit && currentAccount
      ? {
          email: currentAccount.email || '',
          phone: currentAccount.phone || '',
          role: currentAccount.role || 2,
          isActive: BooleanUtils.toBoolean(currentAccount.isActive),
          contact: currentAccount.contact || '',
          shopName: currentAccount.shopName || '',
          address: currentAccount.address || '',
          creditCode: currentAccount.creditCode || '',
          wechatID: currentAccount.wechatID || '',
          remark: currentAccount.remark || '',
          domain: currentAccount.domain || ''
        }
      : {
          phone: '',
          passwordHash: '',
          role: 2,
          isActive: true,
          contact: '',
          shopName: '',
          email: '',
          address: '',
          creditCode: '',
          wechatID: '',
          remark: ''
        }

  const schema = isEdit ? validationSchema.omit(['passwordHash']) : validationSchema

  const openCreate = () => {
    setModalMode('create')
    setCurrentAccount({
      phone: '',
      role: 2,
      isActive: true,
      contact: '',
      shopName: '',
      email: '',
      address: '',
      creditCode: '',
      remark: ''
    })
    setIsModalOpen(true)
  }

  const openEdit = (account: AccountWithProfile) => {
    setModalMode('edit')
    setCurrentAccount(account)
    setIsModalOpen(true)
  }

  const handleSubmit = async (values: any) => {
    if (modalMode === 'create') {
      const input: CreateAccountInput = {
        email: values.email,
        phone: values.phone,
        passwordHash: values.passwordHash,
        role: Number(values.role),
        isActive: BooleanUtils.toBoolean(values.isActive),
        contact: values.contact,
        shopName: values.shopName,
        address: values.address,
        creditCode: values.creditCode,
        wechatID: values.wechatID,
        domain: values.domain,
        remark: values.remark
      }
      const result = await createAccount(input)
      if (result.ok) {
        await mutate()
        addToast({ color: 'success', title: '创建成功' })
        setIsModalOpen(false)
      } else {
        const errors = Array.isArray(result.error) ? result.error : [result.error]
        addToast({
          color: 'danger',
          title: '创建账户失败',
          description: errors.map(error => (error as any).message).join('; ')
        })
      }
    } else if (modalMode === 'edit' && currentAccount?.id) {
      const input: UpdateAccountInput = {
        id: currentAccount.id,
        email: values.email,
        phone: values.phone,
        role: Number(values.role),
        isActive: BooleanUtils.toBoolean(values.isActive),
        contact: values.contact,
        shopName: values.shopName,
        address: values.address,
        creditCode: values.creditCode,
        wechatID: values.wechatID,
        domain: values.domain,
        remark: values.remark
      }
      const result = await updateAccount(input)
      if (result.ok) {
        await mutate()
        const updated = accounts.find(a => a.id === currentAccount.id)
        if (updated) setCurrentAccount(updated)
        addToast({ color: 'success', title: '更新成功' })
        setIsModalOpen(false)
      } else {
        const errors = Array.isArray(result.error) ? result.error : [result.error]
        addToast({
          color: 'danger',
          title: '创建账户失败',
          description: errors.map(error => (error as any).message).join('; ')
        })
      }
    }
  }

  // 使用 SWR 获取数据
  const { accounts, total, isLoading, mutate } = useAccountList({ keyword, page, pageSize: 10 })

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

  return (
    <>
      <div className="mb-3 mt-2 flex justify-between">
        <SearchInput onSearch={handleSearch} />
        <div className="flex">
          <Button
            color="primary"
            size="sm"
            startContent={<Plus size={16} />}
            onPress={openCreate}
            variant="shadow"
          >
            新增账户
          </Button>
        </div>
      </div>
      <AccountTable accounts={accounts} loading={isLoading} onEdit={openEdit} />
      <DataFormModal
        key={`${modalMode}-${isModalOpen}-${currentAccount?.id || 'new'}`}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setCurrentAccount(null)
        }}
        title={isEdit ? '编辑账户' : '新增账户'}
        size="2xl"
        fields={modalFields}
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmit}
      />
    </>
  )
}
