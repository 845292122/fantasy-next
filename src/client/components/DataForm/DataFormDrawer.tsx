'use client'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button
} from '@heroui/react'
import DataForm from './DataForm'
import { DataFormProps } from './types'
import { useFormik } from 'formik'

interface DataFormModalProps extends DataFormProps {
  isOpen: boolean
  onClose: () => void
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
}

interface DataFormDrawerProps extends DataFormModalProps {
  placement?: 'left' | 'right' | 'top' | 'bottom'
}

export default function DataFormDrawer({
  isOpen,
  onClose,
  title,
  placement = 'right',
  size = 'md',
  submitText = '提交',
  cancelText = '取消',
  loading = false,
  ...formProps
}: DataFormDrawerProps) {
  const formik = useFormik({
    initialValues: formProps.initialValues,
    validationSchema: formProps.validationSchema,
    onSubmit: async values => {
      await formProps.onSubmit(values)
    }
  })

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement={placement} size={size} backdrop="blur">
      <DrawerContent>
        {() => (
          <>
            <DrawerHeader className="flex flex-col gap-1">{title}</DrawerHeader>
            <DrawerBody className="py-4">
              <div className="space-y-4">
                <DataForm
                  {...formProps}
                  onSubmit={async values => await formProps.onSubmit(values)}
                  loading={loading}
                  showFooter={false}
                />
              </div>
            </DrawerBody>
            <DrawerFooter>
              <Button variant="flat" onPress={onClose} isDisabled={loading}>
                {cancelText}
              </Button>
              <Button color="primary" onPress={() => formik.handleSubmit()} isLoading={loading}>
                {submitText}
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
