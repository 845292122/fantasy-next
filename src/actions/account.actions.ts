'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@/generated/prisma/client'
import {
  CreateAccountInput,
  createAccountSchema,
  UpdateAccountInput,
  updateAccountSchema
} from '@/schemas/account.schema'
import * as yup from 'yup'

// * 获取账户列表
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

  const [data, total] = await Promise.all([
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

  return { data, total, page, pageSize }
}

// * 获取单个账户
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

  return account
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

    return { success: true, data: result }
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errors = err.inner.map(issue => ({
        path: issue.path,
        message: issue.message
      }))
      return { ok: false, errors }
    }
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
          contact,
          shopName,
          creditCode,
          address,
          domain,
          wechatID,
          remark
        },
        create: {
          accountId: id,
          contact,
          shopName,
          creditCode,
          address,
          domain,
          wechatID,
          remark
        }
      })

      // 3. 返回完整数据
      return await tx.account.findUnique({
        where: { id },
        include: { Profile: true }
      })
    })

    revalidatePath('/system/account')
    return { success: true, data: result }
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errors = err.inner.map(issue => ({
        path: issue.path,
        message: issue.message
      }))
      return { ok: false, errors }
    }
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
