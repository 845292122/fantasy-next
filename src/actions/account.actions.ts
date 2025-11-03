'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@/generated/prisma/client'

// 使用 Prisma 生成的类型
type AccountWithProfile = Prisma.AccountGetPayload<{
  include: { Profile: true }
}>

// 创建账户的输入类型
export interface CreateAccountInput {
  // Account 字段
  phone?: string
  passwordHash?: string
  role?: number
  avatar?: string
  status?: number
  isPremium?: number
  startDate?: Date
  endDate?: Date

  // Profile 字段（同级）
  contact?: string
  shopName?: string
  creditCode?: string
  address?: string
  domain?: string
  birthday?: Date
  email?: string
  wechatID?: string
  remark?: string
}

// 更新账户的输入类型
export interface UpdateAccountInput extends CreateAccountInput {
  id: number
}

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
              OR: [
                { shopName: { contains: keyword } },
                { contact: { contains: keyword } },
                { email: { contains: keyword } }
              ]
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

// * 创建账户
export async function createAccount(input: CreateAccountInput) {
  const {
    // Account 字段
    phone,
    passwordHash,
    role,
    avatar,
    status,
    isPremium,
    startDate,
    endDate,
    // Profile 字段
    contact,
    shopName,
    creditCode,
    address,
    domain,
    birthday,
    email,
    wechatID,
    remark
  } = input

  // 使用事务确保原子性
  const result = await prisma.$transaction(async tx => {
    // 1. 创建 Account
    const account = await tx.account.create({
      data: {
        phone,
        passwordHash,
        role,
        avatar,
        status,
        isPremium,
        startDate,
        endDate,
        // 嵌套创建 Profile
        Profile: {
          create: {
            contact,
            shopName,
            creditCode,
            address,
            domain,
            birthday,
            email,
            wechatID,
            remark
          }
        }
      },
      include: {
        Profile: true
      }
    })

    return account
  })

  revalidatePath('/system/account')
  return { success: true, data: result }
}

// * 更新账户
export async function updateAccount(input: UpdateAccountInput) {
  const {
    id,
    // Account 字段
    phone,
    passwordHash,
    role,
    avatar,
    status,
    isPremium,
    startDate,
    endDate,
    // Profile 字段
    contact,
    shopName,
    creditCode,
    address,
    domain,
    birthday,
    email,
    wechatID,
    remark
  } = input

  // 使用事务确保原子性
  const result = await prisma.$transaction(async tx => {
    // 1. 更新 Account
    await tx.account.update({
      where: { id },
      data: {
        phone,
        passwordHash,
        role,
        avatar,
        status,
        isPremium,
        startDate,
        endDate
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
        birthday,
        email,
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
        birthday,
        email,
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
}

// * 删除账户
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

// * 批量删除账户
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

// * 冻结账户
export async function freezeAccount(id: number) {
  await prisma.account.update({
    where: { id },
    data: { status: 0 }
  })

  revalidatePath('/system/account')
  return { success: true }
}

// * 启用账户
export async function activateAccount(id: number) {
  await prisma.account.update({
    where: { id },
    data: { status: 1 }
  })

  revalidatePath('/system/account')
  return { success: true }
}

// 导出类型供其他地方使用
export type { AccountWithProfile }
