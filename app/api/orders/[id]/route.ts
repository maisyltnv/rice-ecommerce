import { NextRequest, NextResponse } from 'next/server'

const CLIENT_API_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL || 'http://localhost:8081'

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  if (!id) {
    return NextResponse.json({ success: false, error: 'Order id is required' }, { status: 400 })
  }

  try {
    const authHeader = _request.headers.get('authorization') || ''

    const response = await fetch(`${CLIENT_API_BASE_URL}/orders/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    })

    const text = await response.text()
    let data: any
    try {
      data = JSON.parse(text)
    } catch {
      data = { message: text }
    }

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || response.statusText },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
