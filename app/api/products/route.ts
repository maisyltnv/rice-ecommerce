import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export async function GET() {
    try {
        console.log('Proxy: Fetching products from:', `${API_BASE_URL}/products`)

        const response = await fetch(`${API_BASE_URL}/products`, {
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
        console.log('Proxy: Products fetched successfully:', data)

        return NextResponse.json({
            success: true,
            data: data,
            message: 'Products fetched successfully'
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
        console.log('Proxy: Creating product:', body)
        console.log('Proxy: Request headers:', request.headers)

        const authHeader = request.headers.get('Authorization')
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        if (authHeader) {
            headers['Authorization'] = authHeader
        }

        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        })

        console.log('Proxy: Response status:', response.status)
        console.log('Proxy: Response ok:', response.ok)

        if (!response.ok) {
            const errorText = await response.text()
            console.log('Proxy: Error response:', errorText)
            let errorData = {}
            try {
                errorData = JSON.parse(errorText)
            } catch (e) {
                console.log('Proxy: Could not parse error response as JSON')
            }
            return NextResponse.json(
                { success: false, error: errorData.message || `HTTP ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        const data = await response.json()
        console.log('Proxy: Product created successfully:', data)

        return NextResponse.json({
            success: true,
            data: data,
            message: 'Product created successfully'
        })
    } catch (error) {
        console.error('Proxy Error:', error)
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Network error occurred' },
            { status: 500 }
        )
    }
}
