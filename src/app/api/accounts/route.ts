import { getAccounts } from '@/actions/account.actions'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const keyword = searchParams.get('keyword') || ''
    const page = Number(searchParams.get('page') || '1')
    const pageSize = Number(searchParams.get('pageSize') || '10')

    const result = await getAccounts({ keyword, page, pageSize })
    return NextResponse.json(result)
  } catch (error) {
    console.error('获取账户列表失败:', error)
    return NextResponse.json({ error: '获取账户列表失败' }, { status: 500 })
  }
}
