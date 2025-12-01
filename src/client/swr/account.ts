'use client'

import type { AccountWithProfile } from '@/server/schemas/account.schema'
import { PageResponse, useApi } from '.'

interface UseAccountListParams {
  keyword?: string
  page?: number
  pageSize?: number
}

export function useAccountInfo(id?: number) {
  const { data, error, isLoading, mutate } = useApi<AccountWithProfile>(
    id ? `/api/accounts/${id}` : null
  )

  return {
    account: data,
    error,
    isLoading,
    mutate
  }
}

export function useAccountList(params: UseAccountListParams = {}) {
  const { keyword = '', page = 1, pageSize = 10 } = params

  // 构建查询字符串
  const queryString = new URLSearchParams({
    keyword,
    page: String(page),
    pageSize: String(pageSize)
  }).toString()

  const { data, error, isLoading, mutate } = useApi<PageResponse<AccountWithProfile>>(
    `/api/accounts?${queryString}`,
    {
      dedupingInterval: 2000
    }
  )

  return {
    accounts: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.pageSize || 10,
    error,
    isLoading,
    mutate
  }
}
