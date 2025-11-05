import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export async function GET() {
    try {
        console.log('Proxy: Fetching categories from:', `${API_BASE_URL}/categories`)

        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })

        if (!response.ok) {
            console.error('API Error:', response.status, response.statusText)
            return NextResponse.json(
                { success: false, error: `HTTP ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        const data = await response.json()
        console.log('Proxy: Categories fetched successfully:', data)

        return NextResponse.json({
            success: true,
            data: data,
            message: 'Categories fetched successfully'
        })
    } catch (error) {
        console.error('Proxy Error:', error)
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Network error occurred' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        console.log('Proxy: Creating category:', body)

        const authHeader = request.headers.get('Authorization')
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        if (authHeader) {
            headers['Authorization'] = authHeader
        }

        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return NextResponse.json(
                { success: false, error: errorData.message || `HTTP ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        const data = await response.json()
        console.log('Proxy: Category created successfully:', data)

        return NextResponse.json({
            success: true,
            data: data,
            message: 'Category created successfully'
        })
    } catch (error) {
        console.error('Proxy Error:', error)
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Network error occurred' },
            { status: 500 }
        )
    }
}
