import { NextRequest, NextResponse } from 'next/server'

const CLIENT_API_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL || 'http://localhost:8081'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const authHeader = request.headers.get('authorization') || ''

        const response = await fetch(`${CLIENT_API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(authHeader ? { 'Authorization': authHeader } : {}),
            },
            body: JSON.stringify(body),
        })

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
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization') || ''

        const response = await fetch(`${CLIENT_API_BASE_URL}/orders`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                ...(authHeader ? { 'Authorization': authHeader } : {}),
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
            return NextResponse.json({ success: false, error: data.message || response.statusText }, { status: response.status })
        }

        return NextResponse.json({ success: true, data })
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
    }
}


