import { NextRequest, NextResponse } from 'next/server'

const CLIENT_API_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL || 'http://localhost:8081'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const authHeader = request.headers.get('authorization') || ''

        const response = await fetch(`${CLIENT_API_BASE_URL}/customers/${id}`, {
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
            console.error(`Customer by ID ${id} fetch failed:`, {
                status: response.status,
                statusText: response.statusText,
                error: data
            })
            const errorMessage = data.error || data.message || data.detail || response.statusText || 'Not Found'
            return NextResponse.json({ success: false, error: errorMessage }, { status: response.status })
        }

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error(`Customer by ID fetch error for ${params.id}:`, error)
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const body = await request.json()
        const authHeader = request.headers.get('authorization') || ''

        console.log(`Updating customer ${id} with body:`, JSON.stringify(body, null, 2))

        const response = await fetch(`${CLIENT_API_BASE_URL}/customers/${id}`, {
            method: 'PUT',
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
            console.error(`Customer ${id} update failed:`, {
                status: response.status,
                statusText: response.statusText,
                error: data
            })
            const errorMessage = data.error || data.message || data.detail || response.statusText || 'Bad Request'
            return NextResponse.json({ success: false, error: errorMessage }, { status: response.status })
        }

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error(`Customer update error for ${params.id}:`, error)
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
    }
}

