'use client'

import DataTable, { ColumnDef } from '@/components/DataTable'
import { Button, Chip } from '@heroui/react'
import { Edit, UserCheck, UserX } from 'lucide-react'
import { AccountWithProfile } from '@/server/schemas/account.schema'
import { format } from 'date-fns'
import { useThrottle } from '@/hooks'

interface AccountTableProps {
  accounts: AccountWithProfile[]
  loading?: boolean
  onEdit?: (account: AccountWithProfile) => void
  onChangeState?: (account: AccountWithProfile) => void
  total?: number
  onPageChange?: (page: number) => void
  page?: number
}

export default function AccountTable({
  accounts,
  loading,
  onEdit,
  onChangeState,
  total = 0,
  onPageChange,
  page = 1
}: AccountTableProps) {
  // const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))

  // 使用节流 hook
  const throttledChangeState = useThrottle((account: AccountWithProfile) => {
    onChangeState?.(account)
  }, 1000)

  // 定义列
  const columns: ColumnDef<AccountWithProfile>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'shopName',
      label: '店铺名称'
    },
    {
      key: 'contact',
      label: '联系人'
    },
    {
      key: 'phone',
      label: '手机号'
    },
    {
      key: 'email',
      label: '邮箱'
    },
    {
      key: 'role',
      label: '角色',
      render: item => {
        const { role } = item
        const isAdmin = role === 1
        return (
          <Chip
            size="sm"
            variant={isAdmin ? 'shadow' : 'flat'}
            classNames={
              isAdmin
                ? {
                    base: 'bg-linear-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30',
                    content: 'drop-shadow-xs shadow-black text-white'
                  }
                : {}
            }
          >
            {isAdmin ? '管理员' : '普通用户'}
          </Chip>
        )
      }
    },
    {
      key: 'isActive',
      label: '状态',
      align: 'center',
      render: item => {
        const { isActive } = item
        return (
          <Chip size="sm" color={isActive ? 'success' : 'danger'} variant="flat">
            {isActive ? '正常' : '禁用'}
          </Chip>
        )
      }
    },
    {
      key: 'createdAt',
      label: '创建时间',
      sortable: true,
      render: item =>
        item.createdAt ? format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm:ss') : '-'
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
        color={item.isActive ? 'danger' : 'success'}
        onPress={() => handleChangeState(item)}
      >
        {item.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
      </Button>
    </div>
  )

  const handleEdit = (item: AccountWithProfile) => {
    onEdit?.(item)
  }

  const handleChangeState = (account: AccountWithProfile) => {
    throttledChangeState(account)
  }

  // const handleSelectionChange = (keys: Selection) => {
  //   setSelectedKeys(keys)
  //   console.log('选中的行:', keys)
  // }

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
      total={total}
      onPageChange={onPageChange}
      page={page}
    />
  )
}
