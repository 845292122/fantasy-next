'use client'

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react'
import DataForm from './DataForm'
import { DataFormProps } from './types'
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
  loading = false,
  ...formProps
}: DataFormModalProps) {
  const formik = useFormik({
    initialValues: formProps.initialValues,
    validationSchema: formProps.validationSchema,
    onSubmit: async values => {
      await formProps.onSubmit(values)
    }
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} scrollBehavior="inside">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody className="py-4">
              <div className="space-y-4">
                <DataForm
                  {...formProps}
                  onSubmit={async values => await formProps.onSubmit(values)}
                  loading={loading}
                  showFooter={false}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose} isDisabled={loading}>
                {cancelText}
              </Button>
              <Button color="primary" onPress={() => formik.handleSubmit()} isLoading={loading}>
                {submitText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
