import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        console.log('Login Proxy: Attempting login for:', body.username)

        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        })

        console.log('Login Proxy: Response status:', response.status)
        console.log('Login Proxy: Response ok:', response.ok)

        if (!response.ok) {
            const errorText = await response.text()
            console.log('Login Proxy: Error response:', errorText)
            let errorData: any = {}
            try {
                errorData = JSON.parse(errorText)
            } catch (e) {
                console.log('Login Proxy: Could not parse error response as JSON')
            }
            return NextResponse.json(
                { success: false, error: errorData.message || `HTTP ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        const data = await response.json()
        console.log('Login Proxy: Backend response:', JSON.stringify(data, null, 2))
        console.log('Login Proxy: Has token?', !!data.token)
        console.log('Login Proxy: Has user?', !!data.user)

        // Wrap the backend response
        const wrappedResponse = {
            success: true,
            data: data,
            message: data.message || 'Login successful'
        }

        console.log('Login Proxy: Wrapped response:', JSON.stringify(wrappedResponse, null, 2))

        return NextResponse.json(wrappedResponse)
    } catch (error) {
        console.error('Login Proxy Error:', error)
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Network error occurred' },
            { status: 500 }
        )
    }
}
