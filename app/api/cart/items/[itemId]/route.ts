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

const buildHeaders = (request: NextRequest, includeJson = false) => {
  const authHeader = request.headers.get('authorization') || ''
  return {
    ...(includeJson ? { 'Content-Type': 'application/json' } : {}),
    'Accept': 'application/json',
    ...(authHeader ? { Authorization: authHeader } : {}),
  }
}

export async function PUT(request: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const body = await request.text()
    const response = await fetch(`${CLIENT_API_BASE_URL}/cart/items/${params.itemId}`, {
      method: 'PUT',
      headers: buildHeaders(request, true),
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

export async function DELETE(request: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const response = await fetch(`${CLIENT_API_BASE_URL}/cart/items/${params.itemId}`, {
      method: 'DELETE',
      headers: buildHeaders(request),
    })

    return handleResponse(response)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
