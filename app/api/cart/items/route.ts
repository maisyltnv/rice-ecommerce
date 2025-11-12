import { NextRequest, NextResponse } from 'next/server'

const CLIENT_API_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL || 'http://localhost:8081'

const handleResponse = async (response: Response) => {
  const text = await response.text()
  let data: any
  try {
    data = JSON.parse(text)
  } catch {
    data = { message: text }
  }

  if (!response.ok) {
    return NextResponse.json({ success: false, error: data.message || response.statusText }, { status: response.status })
  }

  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const authHeader = request.headers.get('authorization') || ''

    const response = await fetch(`${CLIENT_API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body,
    })

    return handleResponse(response)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
