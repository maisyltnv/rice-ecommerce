// Use Next.js API proxy to avoid CORS issues
const API_BASE_URL = "/api"
const LOGIN_ENDPOINT = "/login"

export interface LoginRequest {
    username: string
    password: string
}

export interface LoginResponse {
    success: boolean
    token?: string
    user?: {
        id: number
        username: string
        email?: string
        role?: string
    }
    error?: string
    message?: string
}

export async function loginAPI(credentials: LoginRequest): Promise<LoginResponse> {
    try {
        console.log('Attempting login to:', `${API_BASE_URL}${LOGIN_ENDPOINT}`)
        console.log('Credentials:', credentials)

        const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(credentials),
            mode: 'cors',
        })

        console.log('Response status:', response.status)
        console.log('Response ok:', response.ok)

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return {
                success: false,
                error: errorData.message || `HTTP ${response.status}: ${response.statusText}`
            }
        }

        const data = await response.json()
        console.log('API Response:', JSON.stringify(data, null, 2))

        // Handle the proxy response format - the proxy wraps the backend response in data.data
        let responseData = null
        
        if (data.success && data.data) {
            // Proxy wrapped response: { success: true, data: { token, user, message } }
            responseData = data.data
            console.log('Using proxy wrapped response:', responseData)
        } else if (data.token && data.user) {
            // Direct backend response: { token, user, message }
            responseData = data
            console.log('Using direct backend response:', responseData)
        } else {
            console.log('Login failed, unexpected response structure:', data)
            return {
                success: false,
                error: data.message || data.error || 'Login failed - unexpected response format'
            }
        }

        // Extract token and user from responseData
        if (responseData && responseData.token && responseData.user) {
            const userData = {
                id: responseData.user.id,
                username: responseData.user.username,
                email: responseData.user.email,
                role: 'admin' // Default role for admin login
            }

            console.log('Login successful, user data:', userData)
            console.log('Token received:', responseData.token.substring(0, 20) + '...')

            return {
                success: true,
                token: responseData.token,
                user: userData,
                message: responseData.message || 'Login successful'
            }
        } else {
            console.log('Login failed, missing token or user in response:', {
                hasToken: !!responseData?.token,
                hasUser: !!responseData?.user,
                responseData
            })
            return {
                success: false,
                error: responseData?.message || responseData?.error || 'Login failed - missing token or user data'
            }
        }
    } catch (error) {
        console.error('Login API error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error occurred'
        }
    }
}

export async function logoutAPI(): Promise<{ success: boolean }> {
    try {
        const token = localStorage.getItem('auth-token')
        if (!token) {
            return { success: true }
        }

        // If you have a logout endpoint, call it here
        // await fetch(`${API_BASE_URL}/logout`, {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //   },
        // })

        return { success: true }
    } catch (error) {
        console.error('Logout API error:', error)
        return { success: true } // Always succeed logout locally
    }
}
