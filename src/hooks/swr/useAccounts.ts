'use client'

import useSWR from 'swr'
import type { AccountWithProfile } from '@/actions/account.actions'

interface UseAccountsParams {
  keyword?: string
  page?: number
  pageSize?: number
}

interface AccountsResponse {
  data: AccountWithProfile[]
  total: number
  page: number
  pageSize: number
}

const fetcher = async (url: string): Promise<AccountsResponse> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('网络请求失败')
  return res.json()
}

export function useAccounts(params: UseAccountsParams = {}) {
  const { keyword = '', page = 1, pageSize = 10 } = params

  // 构建查询字符串
  const queryString = new URLSearchParams({
    keyword,
    page: String(page),
    pageSize: String(pageSize)
  }).toString()

  const { data, error, isLoading, mutate } = useSWR<AccountsResponse>(
    `/api/accounts?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: false,
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
