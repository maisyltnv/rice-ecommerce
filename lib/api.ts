const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
const LOGIN_ENDPOINT = process.env.NEXT_PUBLIC_API_LOGIN_ENDPOINT || '/login'

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

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return {
                success: false,
                error: errorData.message || `HTTP ${response.status}: ${response.statusText}`
            }
        }

        const data = await response.json()
        console.log('API Response:', data)

        // Handle the actual API response format
        if (data.token) {
            const userData = {
                id: data.user_id || data.user?.id || 1,
                username: data.username || data.user?.username || 'admin',
                email: data.email || data.user?.email || 'admin@heritagerice.com',
                role: data.role || data.user?.role || 'admin'
            }

            console.log('Login successful, user data:', userData)

            return {
                success: true,
                token: data.token,
                user: userData,
                message: data.message
            }
        } else {
            console.log('Login failed, no token received')
            return {
                success: false,
                error: data.message || 'Login failed'
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
