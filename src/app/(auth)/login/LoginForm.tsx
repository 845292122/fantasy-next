'use client'

import TextDivider from '@/components/TextDivider'
import { Button, Input } from '@heroui/react'
import { useFormik } from 'formik'
import { Lock, Phone } from 'lucide-react'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  phone: Yup.string().required('手机号不能为空'),
  password: Yup.string().min(6, '密码长度不能少于6位').required('密码不能为空')
})

export default function LoginForm() {
  const formik = useFormik({
    initialValues: {
      phone: '',
      password: ''
    },
    validationSchema,
    onSubmit: async values => {
      console.log('表单提交数据:', values)
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <Input
        label="手机号"
        name="phone"
        type="text"
        labelPlacement="outside-top"
        value={formik.values.phone}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errorMessage={formik.touched.phone && formik.errors.phone}
        isInvalid={!!(formik.touched.phone && formik.errors.phone)}
        startContent={<Phone size={18} />}
      />
      <Input
        label="密码"
        name="password"
        type="password"
        labelPlacement="outside-top"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errorMessage={formik.touched.password && formik.errors.password}
        isInvalid={!!(formik.touched.password && formik.errors.password)}
        startContent={<Lock size={18} />}
      />
      <Button type="submit" color="primary" fullWidth isLoading={formik.isSubmitting}>
        登录
      </Button>
      <TextDivider text="其他登录方式" className="my-6" />
    </form>
  )
}
