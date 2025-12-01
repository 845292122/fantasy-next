'use client'

import { useState } from 'react'
import { Button } from '@heroui/react'
import { FormField } from '@/client/components/DataForm'
import DataFormDrawer from '@/client/components/DataForm/DataFormDrawer'
import DataFormModal from '@/client/components/DataForm/DataFormModal'
import * as Yup from 'yup'

export default function FormExample() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // 表单字段配置
  const fields: FormField[] = [
    {
      name: 'username',
      label: '用户名',
      type: 'text',
      placeholder: '请输入用户名',
      required: true
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'email',
      placeholder: '请输入邮箱',
      required: true
    },
    {
      name: 'password',
      label: '密码',
      type: 'password',
      placeholder: '请输入密码',
      required: true
    },
    {
      name: 'age',
      label: '年龄',
      type: 'number',
      placeholder: '请输入年龄',
      min: 1,
      max: 120
    },
    {
      name: 'bio',
      label: '个人简介',
      type: 'textarea',
      placeholder: '请输入个人简介',
      rows: 4
    },
    {
      name: 'role',
      label: '角色',
      type: 'select',
      placeholder: '请选择角色',
      required: true,
      options: [
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' },
        { label: '访客', value: 'guest' }
      ]
    },
    {
      name: 'gender',
      label: '性别',
      type: 'radio',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
        { label: '其他', value: 'other' }
      ]
    },
    {
      name: 'interests',
      label: '兴趣爱好',
      type: 'checkbox',
      options: [
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
        { label: '旅游', value: 'travel' }
      ]
    },
    {
      name: 'active',
      label: '是否启用',
      type: 'switch'
    }
  ]

  // 初始值
  const initialValues = {
    username: '',
    email: '',
    password: '',
    age: '',
    bio: '',
    role: '',
    gender: '',
    interests: [],
    active: true
  }

  // 验证规则
  const validationSchema = Yup.object({
    username: Yup.string().required('用户名是必填项').min(3, '用户名至少3个字符'),
    email: Yup.string().email('请输入有效的邮箱').required('邮箱是必填项'),
    password: Yup.string().required('密码是必填项').min(6, '密码至少6个字符'),
    age: Yup.number().min(1, '年龄必须大于0').max(120, '年龄不能超过120'),
    role: Yup.string().required('角色是必填项')
  })

  // 提交处理
  const handleSubmit = async (values: any) => {
    console.log('表单提交:', values)
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('提交成功!')
    setIsModalOpen(false)
    setIsDrawerOpen(false)
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">表单示例</h1>

      <div className="flex gap-4">
        <Button color="primary" onPress={() => setIsModalOpen(true)}>
          打开 Modal 表单
        </Button>
        <Button color="secondary" onPress={() => setIsDrawerOpen(true)}>
          打开 Drawer 表单
        </Button>
      </div>

      {/* Modal 表单 */}
      <DataFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="新增用户"
        size="2xl"
        fields={fields}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      />

      {/* Drawer 表单 */}
      <DataFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="编辑用户"
        placement="right"
        size="md"
        fields={fields}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
