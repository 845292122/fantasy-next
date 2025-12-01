'use client'

import TextDivider from '@/client/components/TextDivider'
import { Button, Checkbox, Input, Link } from '@heroui/react'
import { useFormik } from 'formik'
import { Fingerprint, Lock, Phone } from 'lucide-react'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  phone: Yup.string().required('手机号不能为空'),
  password: Yup.string().min(6, '密码长度不能少于6位').required('密码不能为空')
})

export default function LoginForm() {
  const formik = useFormik({
    initialValues: {
      phone: '',
      password: '',
      rememberMe: false
    },
    validationSchema,
    onSubmit: async values => {
      console.log('表单提交数据:', values)
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <Input
        label={formik.touched.phone && formik.errors.phone ? formik.errors.phone : '手机号'}
        name="phone"
        type="text"
        labelPlacement="outside-top"
        value={formik.values.phone}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isInvalid={!!(formik.touched.phone && formik.errors.phone)}
        startContent={<Phone size={18} />}
      />
      <div>
        <div className="flex justify-between items-center mb-2">
          <label
            className={`text-sm ${formik.touched.password && formik.errors.password ? 'text-danger' : 'text-foreground'}`}
          >
            {formik.touched.password && formik.errors.password ? formik.errors.password : '密码'}
          </label>
          <Link color="primary" className="cursor-pointer text-sm">
            忘记密码 ?
          </Link>
        </div>
        <Input
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={!!(formik.touched.password && formik.errors.password)}
          startContent={<Lock size={18} />}
        />
      </div>
      <Checkbox
        name="rememberMe"
        isSelected={formik.values.rememberMe}
        onValueChange={value => formik.setFieldValue('rememberMe', value)}
        size="sm"
      >
        记住我
      </Checkbox>
      <Button
        type="submit"
        color="primary"
        variant="shadow"
        fullWidth
        isLoading={formik.isSubmitting}
        className="mt-2"
      >
        登 录
      </Button>
      <div className="text-center text-sm text-gray-600">
        还没有账号？
        <Link href="#" underline="always" className="ml-1 text-sm">
          请注册
        </Link>
      </div>
      <TextDivider text="其他登录方式" />
      <Button
        variant="flat"
        radius="full"
        color="success"
        fullWidth
        isDisabled
        startContent={<Fingerprint size={18} />}
      >
        使用微信登录
      </Button>
    </form>
  )
}
