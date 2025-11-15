import * as yup from 'yup'

export const createAccountSchema = yup
  .object({
    email: yup.string().email('邮箱格式错误').optional(),
    phone: yup.string().trim().min(11, '手机号长度不足').required('手机号必填'),
    passwordHash: yup.string().min(6, '密码长度不能少于6位').required('密码必填'),
    role: yup.number().required('角色必填'),
    avatar: yup.string().optional(),
    isActive: yup.boolean().optional().default(true),
    contact: yup.string().required('联系人必填'),
    shopName: yup.string().required('店铺名称必填'),
    creditCode: yup.string().optional(),
    address: yup.string().optional(),
    domain: yup.string().optional(),
    wechatID: yup.string().optional(),
    remark: yup.string().max(200, '备注不能超过200字').optional()
  })
  .noUnknown('存在未知字段')

export const updateAccountSchema = createAccountSchema
  .omit(['passwordHash'])
  .shape({
    id: yup.number().integer('id必须为整数').positive('id必须为正数').required('id必填')
  })
  .noUnknown('存在未知字段')

export type CreateAccountInput = yup.InferType<typeof createAccountSchema>
export type UpdateAccountInput = yup.InferType<typeof updateAccountSchema>
