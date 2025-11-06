import { NextRequest, NextResponse } from 'next/server'

const CLIENT_API_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL || "http://localhost:8081"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        console.log('Client Login Proxy: Attempting login for:', body.email)

        const response = await fetch(`${CLIENT_API_BASE_URL}/customers/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email: body.email,
                password: body.password
            }),
        })

        console.log('Client Login Proxy: Response status:', response.status)
        console.log('Client Login Proxy: Response ok:', response.ok)

        if (!response.ok) {
            const errorText = await response.text()
            console.log('Client Login Proxy: Error response:', errorText)
            let errorData: any = {}
            try {
                errorData = JSON.parse(errorText)
            } catch (e) {
                console.log('Client Login Proxy: Could not parse error response as JSON')
            }
            return NextResponse.json(
                { success: false, error: errorData.message || `HTTP ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        const data = await response.json()
        console.log('Client Login Proxy: Backend response:', JSON.stringify(data, null, 2))
        console.log('Client Login Proxy: Has token?', !!data.token)
        console.log('Client Login Proxy: Has user?', !!data.user)

        // Wrap the backend response
        const wrappedResponse = {
            success: true,
            data: data,
            message: data.message || 'Login successful'
        }

        console.log('Client Login Proxy: Wrapped response:', JSON.stringify(wrappedResponse, null, 2))

        return NextResponse.json(wrappedResponse)
    } catch (error) {
        console.error('Client Login Proxy Error:', error)
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Network error occurred' },
            { status: 500 }
        )
    }
}

