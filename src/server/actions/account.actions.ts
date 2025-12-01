'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  CreateAccountInput,
  createAccountSchema,
  UpdateAccountInput,
  updateAccountSchema
} from '@/server/schemas/account.schema'
import * as yup from 'yup'
import { Prisma } from '../../../generated/prisma/client'

/**
 * 获取账户列表
 * @param params
 * @returns
 */
export async function getAccounts(params?: { keyword?: string; page?: number; pageSize?: number }) {
  const { keyword = '', page = 1, pageSize = 10 } = params || {}

  // 搜索条件（支持 phone、shopName、contact 等搜索）
  const where: Prisma.AccountWhereInput = keyword
    ? {
        OR: [
          { phone: { contains: keyword } },
          {
            Profile: {
              OR: [{ shopName: { contains: keyword } }, { contact: { contains: keyword } }]
            }
          }
        ]
      }
    : {}

  const [accounts, total] = await Promise.all([
    prisma.account.findMany({
      where,
      include: {
        Profile: true // 包含关联的 Profile
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.account.count({ where })
  ])

  // 格式化数据
  const data = accounts.map(account => ({
    id: account.id,
    email: account.email,
    phone: account.phone,
    role: account.role,
    avatar: account.avatar,
    isActive: account.isActive,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    // 从 Profile 中提取字段
    shopName: account.Profile?.shopName || '',
    contact: account.Profile?.contact || '',
    creditCode: account.Profile?.creditCode || '',
    address: account.Profile?.address || '',
    domain: account.Profile?.domain || '',
    wechatID: account.Profile?.wechatID || '',
    remark: account.Profile?.remark || ''
  }))

  return { data, total, page, pageSize }
}

/**
 * 获取单个账户
 * @param id
 * @returns
 */
export async function getAccount(id: number) {
  const account = await prisma.account.findUnique({
    where: { id },
    include: {
      Profile: true
    }
  })

  if (!account) {
    throw new Error('账户不存在')
  }

  return {
    id: account.id,
    email: account.email,
    phone: account.phone,
    role: account.role,
    avatar: account.avatar,
    isActive: account.isActive,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    // 从 Profile 中提取字段
    shopName: account.Profile?.shopName || '',
    contact: account.Profile?.contact || '',
    creditCode: account.Profile?.creditCode || '',
    address: account.Profile?.address || '',
    domain: account.Profile?.domain || '',
    wechatID: account.Profile?.wechatID || '',
    remark: account.Profile?.remark || ''
  }
}

/**
 * 创建账户
 * @param raw
 */
export async function createAccount(raw: CreateAccountInput) {
  try {
    const data = await createAccountSchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true
    })

    const {
      email,
      phone,
      passwordHash,
      role,
      avatar,
      isActive,
      contact,
      shopName,
      creditCode,
      address,
      domain,
      wechatID,
      remark
    } = data

    // 使用事务确保原子性
    const result = await prisma.account.create({
      data: {
        email,
        phone,
        passwordHash,
        role,
        avatar,
        isActive,
        // 嵌套创建 Profile
        Profile: {
          create: {
            contact,
            shopName,
            creditCode,
            address,
            domain,
            wechatID,
            remark
          }
        }
      },
      include: {
        Profile: true
      }
    })

    revalidatePath('/system/account')

    return { ok: true, data: result }
  } catch (err) {
    let error = err
    if (err instanceof yup.ValidationError) {
      error = err.inner.map(issue => ({
        path: issue.path,
        message: issue.message
      }))
    } else {
      error = '创建账户失败'
    }
    return { ok: false, error }
  }
}

/**
 * 更新账户
 * @param raw
 */
export async function updateAccount(raw: UpdateAccountInput) {
  try {
    const data = await updateAccountSchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true
    })

    const {
      id,
      email,
      phone,
      role,
      avatar,
      isActive,
      contact,
      shopName,
      creditCode,
      address,
      domain,
      wechatID,
      remark
    } = data

    // 使用事务确保原子性
    const result = await prisma.$transaction(async tx => {
      // 1. 更新 Account
      await tx.account.update({
        where: { id },
        data: {
          email,
          phone,
          role,
          avatar,
          isActive
        }
      })

      // 2. 更新或创建 Profile（upsert）
      await tx.profile.upsert({
        where: { accountId: id },
        update: {
          contact: contact || '',
          shopName: shopName || '',
          creditCode: creditCode || '',
          address: address || '',
          domain: domain || '',
          wechatID: wechatID || '',
          remark: remark || ''
        },
        create: {
          accountId: id,
          contact: contact || '',
          shopName: shopName || '',
          creditCode: creditCode || '',
          address: address || '',
          domain: domain || '',
          wechatID: wechatID || '',
          remark: remark || ''
        }
      })

      // 3. 返回完整数据
      return await tx.account.findUnique({
        where: { id },
        include: { Profile: true }
      })
    })

    revalidatePath('/system/account')
    return { ok: true, data: result }
  } catch (err) {
    let error = err
    if (err instanceof yup.ValidationError) {
      error = err.inner.map(issue => ({
        path: issue.path,
        message: issue.message
      }))
    }
    return { ok: false, error }
  }
}

/**
 * 删除账户
 * @param id
 */
export async function deleteAccount(id: number) {
  await prisma.$transaction(async tx => {
    // 1. 先删除 Profile（如果存在）
    await tx.profile.deleteMany({
      where: { accountId: id }
    })

    // 2. 删除 Account
    await tx.account.delete({
      where: { id }
    })
  })

  revalidatePath('/system/account')
  return { success: true }
}

/**
 * 批量删除账户
 * @param ids
 */
export async function deleteAccounts(ids: number[]) {
  await prisma.$transaction(async tx => {
    // 1. 先删除所有关联的 Profile
    await tx.profile.deleteMany({
      where: { accountId: { in: ids } }
    })

    // 2. 批量删除 Account
    await tx.account.deleteMany({
      where: { id: { in: ids } }
    })
  })

  revalidatePath('/system/account')
  return { success: true }
}

/**
 * 冻结账户
 * @param id
 */
export async function freezeAccount(id: number) {
  await prisma.$transaction(async tx => {
    // 1. 冻结关联的 Profile
    await tx.profile.update({
      where: { accountId: id, isActive: true },
      data: {
        isActive: false
      }
    })

    // 2. 冻结 Account
    await tx.account.update({
      where: { id, isActive: true },
      data: {
        isActive: false
      }
    })
  })

  revalidatePath('/system/account')
  return { success: true }
}

/**
 * 启用账户
 * @param id
 */
export async function activateAccount(id: number) {
  await prisma.$transaction(async tx => {
    await tx.account.update({
      where: { id, isActive: false },
      data: {
        isActive: true
      }
    })

    await tx.profile.update({
      where: { accountId: id, isActive: false },
      data: {
        isActive: true
      }
    })
  })

  revalidatePath('/system/account')
  return { success: true }
}
