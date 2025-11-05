'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Switch
} from '@heroui/react'
import { DataFormProps, FormField } from './types'
import { useFormik } from 'formik'

interface DataFormModalProps extends DataFormProps {
  isOpen: boolean
  onClose: () => void
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
}

export default function DataFormModal({
  isOpen,
  onClose,
  title,
  size = 'md',
  submitText = '提交',
  cancelText = '取消',
  fields,
  initialValues,
  validationSchema,
  onSubmit
}: DataFormModalProps) {
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async values => {
      try {
        await onSubmit(values)
        onClose()
      } catch (error) {
        console.error('提交失败:', error)
      }
    }
  })

  const renderField = (field: FormField) => {
    const { name, label, type, placeholder, required, disabled, options, rows } = field
    const error = formik.touched[name] && formik.errors[name]
    const errorMessage = error ? String(error) : undefined

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
            value={String(formik.values[name] || '')}
            onValueChange={value => formik.setFieldValue(name, value)}
            isRequired={required}
            isDisabled={disabled}
            isInvalid={!!error}
            errorMessage={errorMessage}
          >
            {(options || []).map(option => (
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
          >
            {(options || []).map(option => (
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
    <Modal isOpen={isOpen} onClose={onClose} size={size} scrollBehavior="inside">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody className="py-4">
              <div className="space-y-4">{fields.map(field => renderField(field))}</div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose} isDisabled={formik.isSubmitting}>
                {cancelText}
              </Button>
              <Button
                color="primary"
                onPress={() => formik.handleSubmit()}
                isLoading={formik.isSubmitting}
              >
                {submitText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
