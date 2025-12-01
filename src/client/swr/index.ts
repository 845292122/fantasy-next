'use client'

import useSWR, { SWRConfiguration } from 'swr'

export interface PageResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('网络请求失败')
  return res.json()
}

export function useApi<T>(url: string | null, options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    ...options
  })

  return { data, error, isLoading, mutate }
}
