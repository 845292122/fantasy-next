'use client'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Selection,
  Spinner
} from '@heroui/react'
import { ReactNode, useMemo } from 'react'

export interface ColumnDef<T = any> {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T) => ReactNode
  align?: 'start' | 'center' | 'end'
}

interface DataTableProps<T = any> {
  data: T[]
  columns: ColumnDef<T>[]
  actions?: (item: T) => ReactNode
  rowKey?: string
  pageSize?: number
  selectionMode?: 'none' | 'single' | 'multiple'
  onSelectionChange?: (keys: Selection) => void
  selectedKeys?: Selection
  emptyContent?: string
  loading?: boolean
  total?: number
  onPageChange?: (page: number) => void
  page?: number
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  rowKey = 'id',
  pageSize = 10,
  selectionMode = 'none',
  onSelectionChange,
  selectedKeys,
  emptyContent = '暂无数据',
  loading = false,
  total = 0,
  onPageChange,
  page = 1
}: DataTableProps<T>) {
  // 总页数
  const pages = Math.ceil(total / pageSize)

  // 自动判断是否显示多选框
  const finalSelectionMode = useMemo(() => {
    // 如果没有传入 selectedKeys 和 onSelectionChange，则不显示多选框
    if (!selectedKeys && !onSelectionChange) {
      return 'none'
    }
    return selectionMode
  }, [selectedKeys, onSelectionChange, selectionMode])

  // 如果有 actions，添加操作列
  const tableColumns = useMemo(() => {
    if (actions) {
      return [
        ...columns,
        {
          key: 'actions',
          label: '操作',
          align: 'center' as const
        }
      ]
    }
    return columns
  }, [columns, actions])

  return (
    <div className="flex flex-col gap-4">
      <Table
        aria-label="数据表格"
        removeWrapper
        selectionMode={finalSelectionMode}
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        classNames={{
          wrapper: 'min-h-[400px]'
        }}
        bottomContent={
          pages > 1 && (
            <div className="flex justify-center">
              <Pagination
                isCompact
                showControls
                total={pages}
                page={page}
                onChange={onPageChange}
                className="cursor-pointer"
              />
            </div>
          )
        }
      >
        <TableHeader columns={tableColumns}>
          {column => (
            <TableColumn key={column.key} align={column.align} allowsSorting={column.sortable}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={data}
          emptyContent={emptyContent}
          isLoading={loading}
          loadingContent={<Spinner label="加载中..." variant="wave" />}
        >
          {item => (
            <TableRow key={item[rowKey]}>
              {columnKey => {
                // 操作列
                if (columnKey === 'actions' && actions) {
                  return <TableCell>{actions(item)}</TableCell>
                }

                // 查找列配置
                const column = columns.find(col => col.key === columnKey)

                // 自定义渲染
                if (column?.render) {
                  return <TableCell>{column.render(item)}</TableCell>
                }

                // 默认渲染
                return <TableCell>{item[columnKey]}</TableCell>
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
