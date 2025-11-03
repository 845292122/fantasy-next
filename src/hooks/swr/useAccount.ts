'use client'

import useSWR from 'swr'
import type { AccountWithProfile } from '@/actions/account.actions'

const fetcher = async (url: string): Promise<AccountWithProfile> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('网络请求失败')
  return res.json()
}

export function useAccount(id?: number) {
  const { data, error, isLoading, mutate } = useSWR<AccountWithProfile>(
    id ? `/api/accounts/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false
    }
  )

  return {
    account: data,
    error,
    isLoading,
    mutate
  }
}
