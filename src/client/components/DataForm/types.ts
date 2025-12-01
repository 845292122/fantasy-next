import { ReactNode } from 'react'

export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'date'
  | 'dateRange'

export interface SelectOption {
  label: string
  value: string | number | boolean
}

export interface FormField {
  name: string
  label: string
  type: FormFieldType
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: SelectOption[] // 用于 select, radio, checkbox
  rows?: number // 用于 textarea
  min?: number // 用于 number
  max?: number // 用于 number
  helperText?: string
  render?: (value: any, onChange: (value: any) => void) => ReactNode // 自定义渲染
}

export interface DataFormProps {
  fields: FormField[]
  initialValues: Record<string, any>
  validationSchema?: any
  onSubmit: (values: Record<string, any>) => void | Promise<void>
  submitText?: string
  cancelText?: string
  onCancel?: () => void
  loading?: boolean
  showFooter?: boolean // 是否显示底部按钮
}
