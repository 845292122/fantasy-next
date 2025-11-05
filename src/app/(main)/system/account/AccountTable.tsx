'use client'

import { AccountWithProfile } from '@/actions/account.actions'
import DataTable, { ColumnDef } from '@/components/DataTable'
import { Button, Chip, Selection } from '@heroui/react'
import { Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface AccountTableProps {
  accounts: AccountWithProfile[]
  loading?: boolean
  onEdit?: (account: AccountWithProfile) => void
  onDelete?: (account: AccountWithProfile) => void
}

export default function AccountTable({ accounts, loading, onEdit, onDelete }: AccountTableProps) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))

  // 定义列
  const columns: ColumnDef<AccountWithProfile>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'username',
      label: '用户名',
      sortable: true
    },
    {
      key: 'email',
      label: '邮箱'
    },
    {
      key: 'role',
      label: '角色',
      render: item => (
        <Chip size="sm" variant="flat">
          {item.role}
        </Chip>
      )
    },
    {
      key: 'status',
      label: '状态',
      align: 'center',
      render: item => {
        const isActive = Number(item.status) === 1
        return (
          <Chip size="sm" color={isActive ? 'success' : 'default'} variant="flat">
            {isActive ? '正常' : '禁用'}
          </Chip>
        )
      }
    },
    {
      key: 'createdAt',
      label: '创建时间',
      sortable: true
    }
  ]

  // 操作列
  const renderActions = (item: AccountWithProfile) => (
    <div className="flex items-center gap-2 justify-center">
      <Button isIconOnly size="sm" variant="light" onPress={() => handleEdit(item)}>
        <Edit size={16} />
      </Button>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        color="danger"
        onPress={() => handleDelete(item)}
      >
        <Trash2 size={16} />
      </Button>
    </div>
  )

  const handleEdit = (item: AccountWithProfile) => {
    onEdit?.(item)
  }

  const handleDelete = (item: AccountWithProfile) => {
    onDelete?.(item)
  }

  const handleSelectionChange = (keys: Selection) => {
    setSelectedKeys(keys)
    console.log('选中的行:', keys)
  }

  return (
    <DataTable
      data={accounts}
      columns={columns}
      actions={renderActions}
      rowKey="id"
      pageSize={10}
      selectionMode="multiple"
      loading={loading}
      emptyContent="暂无账号数据"
    />
  )
}
