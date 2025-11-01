'use client'

import { useFormik } from 'formik'
import {
  Input,
  Textarea,
  Select,
  SelectItem,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Switch,
  Button
} from '@heroui/react'
import { FormField, DataFormProps } from './types'

export default function DataForm({
  fields,
  initialValues,
  validationSchema,
  onSubmit,
  submitText = '提交',
  cancelText = '取消',
  onCancel,
  loading = false,
  showFooter = true
}: DataFormProps) {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      await onSubmit(values)
    }
  })

  const renderField = (field: FormField) => {
    const {
      name,
      label,
      type,
      placeholder,
      required,
      disabled,
      options,
      rows,
      min,
      max,
      helperText,
      render
    } = field
    const error = formik.touched[name] && formik.errors[name]
    const errorMessage = error ? String(error) : undefined

    // 自定义渲染
    if (render) {
      return (
        <div key={name}>
          {render(formik.values[name], value => formik.setFieldValue(name, value))}
        </div>
      )
    }

    // 根据类型渲染不同的表单组件
    switch (type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <Input
            key={name}
            name={name}
            label={label}
            type={type}
            placeholder={placeholder}
            value={formik.values[name] || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isRequired={required}
            isDisabled={disabled}
            isInvalid={!!error}
            errorMessage={errorMessage}
            description={helperText}
            min={min}
            max={max}
          />
        )

      case 'textarea':
        return (
          <Textarea
            key={name}
            name={name}
            label={label}
            placeholder={placeholder}
            value={formik.values[name] || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isRequired={required}
            isDisabled={disabled}
            isInvalid={!!error}
            errorMessage={errorMessage}
            description={helperText}
            minRows={rows || 3}
          />
        )

      case 'select':
        return (
          <Select
            key={name}
            name={name}
            label={label}
            placeholder={placeholder}
            selectedKeys={formik.values[name] ? [String(formik.values[name])] : []}
            onSelectionChange={keys => {
              const value = Array.from(keys)[0]
              formik.setFieldValue(name, value)
            }}
            isRequired={required}
            isDisabled={disabled}
            isInvalid={!!error}
            errorMessage={errorMessage}
            description={helperText}
          >
            {(options || []).map(option => (
              <SelectItem key={String(option.value)}>{option.label}</SelectItem>
            ))}
          </Select>
        )

      case 'radio':
        return (
          <RadioGroup
            key={name}
            label={label}
            value={formik.values[name]}
            onValueChange={value => formik.setFieldValue(name, value)}
            isRequired={required}
            isDisabled={disabled}
            isInvalid={!!error}
            errorMessage={errorMessage}
            description={helperText}
          >
            {options?.map(option => (
              <Radio key={String(option.value)} value={String(option.value)}>
                {option.label}
              </Radio>
            ))}
          </RadioGroup>
        )

      case 'checkbox':
        return (
          <CheckboxGroup
            key={name}
            label={label}
            value={formik.values[name] || []}
            onValueChange={value => formik.setFieldValue(name, value)}
            isRequired={required}
            isDisabled={disabled}
            isInvalid={!!error}
            errorMessage={errorMessage}
            description={helperText}
          >
            {options?.map(option => (
              <Checkbox key={String(option.value)} value={String(option.value)}>
                {option.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        )

      case 'switch':
        return (
          <Switch
            key={name}
            name={name}
            isSelected={formik.values[name] || false}
            onValueChange={value => formik.setFieldValue(name, value)}
            isDisabled={disabled}
          >
            {label}
          </Switch>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full" role="form">
      <div className="flex-1 overflow-auto space-y-4">
        {fields.map(field => renderField(field))}
      </div>

      {showFooter && (
        <div className="flex gap-2 justify-end pt-4 border-t border-gray-200 bg-white">
          {onCancel && (
            <Button variant="flat" onPress={onCancel} isDisabled={loading}>
              {cancelText}
            </Button>
          )}
          <Button color="primary" onPress={() => formik.handleSubmit()} isLoading={loading}>
            {submitText}
          </Button>
        </div>
      )}
    </div>
  )
}
