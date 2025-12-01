'use client'

import { Input } from '@heroui/react'
import { debounce } from 'lodash-es'
import { Search } from 'lucide-react'
import { useMemo } from 'react'

interface SearchInputProps {
  placeholder?: string
  onSearch: (keyword: string) => void
  debounceMs?: number
}

export default function SearchInput({
  placeholder = '输入关键字来查询',
  onSearch,
  debounceMs = 500
}: SearchInputProps) {
  const debouncedSearch = useMemo(
    () => debounce((value: string) => onSearch(value), debounceMs),
    [onSearch, debounceMs]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  return (
    <Input
      placeholder={placeholder}
      onChange={handleChange}
      startContent={<Search size={18} className="text-gray-400" />}
      size="sm"
      className="w-64"
    />
  )
}
