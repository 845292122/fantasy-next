import { getAccount } from '@/server/actions/account.actions'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的ID' }, { status: 400 })
    }

    const account = await getAccount(id)
    return NextResponse.json(account)
  } catch (error) {
    console.error('获取账户详情失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取账户详情失败' },
      { status: 500 }
    )
  }
}
