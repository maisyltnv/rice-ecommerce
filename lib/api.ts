// Use Next.js API proxy to avoid CORS issues
const API_BASE_URL = "/api"
const LOGIN_ENDPOINT = "/login"

export interface LoginRequest {
    username: string
    password: string
}

export interface CustomerLoginRequest {
    email: string
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

export async function clientLoginAPI(credentials: CustomerLoginRequest): Promise<LoginResponse> {
    try {
        console.log('Attempting client login to:', `${API_BASE_URL}/client-login`)
        console.log('Credentials:', credentials)

        const response = await fetch(`${API_BASE_URL}/client-login`, {
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
                error: errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`
            }
        }

        const data = await response.json()
        console.log('API Response:', JSON.stringify(data, null, 2))

        // Handle the proxy response format - the proxy wraps the backend response in data.data
        let responseData = null

        if (data.success && data.data) {
            // Proxy wrapped response: { success: true, data: { token, customer, message } }
            responseData = data.data
            console.log('Using proxy wrapped response:', responseData)
        } else if (data.token && (data.customer || data.user)) {
            // Direct backend response: { token, customer, message }
            responseData = data
            console.log('Using direct backend response:', responseData)
        } else {
            console.log('Login failed, unexpected response structure:', data)
            return {
                success: false,
                error: data.message || data.error || 'Login failed - unexpected response format'
            }
        }

        // Extract token and customer/user from responseData
        // Backend returns 'customer' object, not 'user'
        const customer = responseData?.customer || responseData?.user

        if (responseData && responseData.token && customer) {
            const userData = {
                id: customer.id,
                username: customer.name || customer.username || customer.email,
                email: customer.email,
                role: 'client' // Role for client login
            }

            console.log('Client login successful, user data:', userData)
            console.log('Token received:', responseData.token.substring(0, 20) + '...')

            return {
                success: true,
                token: responseData.token,
                user: userData,
                message: responseData.message || 'Login successful'
            }
        } else {
            console.log('Login failed, missing token or customer in response:', {
                hasToken: !!responseData?.token,
                hasCustomer: !!responseData?.customer,
                hasUser: !!responseData?.user,
                responseData
            })
            return {
                success: false,
                error: responseData?.message || responseData?.error || 'Login failed - missing token or customer data'
            }
        }
    } catch (error) {
        console.error('Client Login API error:', error)
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

// Orders

export interface OrderItemPayload {
    product_id: number
    quantity: number
}

export interface CustomerInfo {
    email: string
    firstName?: string
    lastName?: string
}

export interface CustomerRegistrationRequest {
    name: string
    email: string
    password: string
    phone: string
    address: string
}

export interface CustomerRegistrationResponse {
    success: boolean
    token?: string
    customer?: {
        id: number
        name: string
        email: string
        phone?: string
    }
    error?: string
    message?: string
}

export interface Customer {
    id: number
    name: string
    email: string
    phone?: string
    address?: string
}

export interface CustomerUpdateRequest {
    name?: string
    email?: string
    phone?: string
    address?: string
    password?: string
}

export interface CustomerResponse {
    success: boolean
    customer?: Customer
    error?: string
    message?: string
}

export interface ShippingAddress {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
}

export interface CreateOrderResponse {
    success: boolean
    order?: any
    error?: string
}

export async function createOrderAPI(
    items: OrderItemPayload[],
    customerInfo?: CustomerInfo,
    shippingAddress?: ShippingAddress,
    customerId?: number
): Promise<CreateOrderResponse> {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
        const body: any = { items }

        if (customerInfo) {
            body.email = customerInfo.email
            if (customerInfo.firstName) body.first_name = customerInfo.firstName
            if (customerInfo.lastName) body.last_name = customerInfo.lastName
            body.customer_name = `${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim()
        }

        if (shippingAddress) {
            body.shipping_address = {
                street: shippingAddress.street,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zip_code: shippingAddress.zipCode,
                country: shippingAddress.country,
            }
        }

        if (customerId) body.customer_id = customerId

        const res = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            const errorMessage = err.error || err.message || err.detail || `HTTP ${res.status}: ${res.statusText}`
            console.error('Order creation failed:', {
                status: res.status,
                statusText: res.statusText,
                error: err,
                body: body
            })
            return { success: false, error: errorMessage }
        }

        const data = await res.json()
        const responseData = data?.data || data
        return { success: true, order: responseData }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Network error occurred' }
    }
}

export async function updateOrderStatusAPI(orderId: number | string, status: string): Promise<CreateOrderResponse> {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
        const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ status }),
        })

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            return { success: false, error: err.message || `HTTP ${res.status}: ${res.statusText}` }
        }

        const data = await res.json()
        const responseData = data?.data || data
        return { success: true, order: responseData }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Network error occurred' }
    }
}

export async function registerCustomerAPI(payload: CustomerRegistrationRequest): Promise<CustomerRegistrationResponse> {
    try {
        const res = await fetch(`${API_BASE_URL}/customers/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        const text = await res.text()
        let data: any
        try {
            data = JSON.parse(text)
        } catch {
            data = { message: text }
        }

        if (!res.ok) {
            return {
                success: false,
                error: data.message || data.error || `HTTP ${res.status}: ${res.statusText}`,
            }
        }

        const customer = data?.customer || data?.data?.customer
        const token = data?.token || data?.data?.token
        const message = data?.message || data?.data?.message

        return {
            success: true,
            customer,
            token,
            message,
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error occurred',
        }
    }
}

export interface BackendOrderItem {
    product_id?: number
    quantity: number
    product?: { id: number; name: string; price: number; image?: string }
    price?: number
}

export interface BackendOrder {
    id: number | string
    status: string
    total?: number
    created_at?: string
    createdAt?: string
    items: BackendOrderItem[]
}

export async function fetchOrdersAPI(): Promise<{ success: boolean; orders?: BackendOrder[]; error?: string }> {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
        const res = await fetch(`${API_BASE_URL}/orders`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        })

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            return { success: false, error: err.message || `HTTP ${res.status}: ${res.statusText}` }
        }

        const data = await res.json()
        const responseData = data?.data || data
        return { success: true, orders: responseData }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Network error occurred' }
    }
}

// Cart

export interface BackendCartItem {
    id: number
    product_id: number
    product_name: string
    product_image?: string
    unit_price: number
    quantity: number
    subtotal?: number
}

export interface BackendCart {
    id: number
    customer_id: number
    total_amount: number
    items: BackendCartItem[]
}

const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {}
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    return headers
}

const mapCartResponse = (data: any): BackendCart | undefined => {
    if (!data) return undefined
    if (data?.data?.cart) return data.data.cart
    if (data?.data) return data.data
    if (data?.cart) return data.cart
    return data
}

export async function fetchCartAPI(): Promise<{ success: boolean; cart?: BackendCart; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/cart`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                ...getAuthHeaders(),
            },
        })

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            return { success: false, error: err.message || `HTTP ${res.status}: ${res.statusText}` }
        }

        const data = await res.json()
        return { success: true, cart: mapCartResponse(data) }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Network error occurred' }
    }
}

export async function addCartItemAPI(productId: number, quantity: number): Promise<{ success: boolean; cart?: BackendCart; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/cart/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify({ product_id: productId, quantity }),
        })

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            return { success: false, error: err.message || `HTTP ${res.status}: ${res.statusText}` }
        }

        const data = await res.json()
        return { success: true, cart: mapCartResponse(data) }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Network error occurred' }
    }
}

export async function updateCartItemAPI(itemId: number, quantity: number): Promise<{ success: boolean; cart?: BackendCart; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify({ quantity }),
        })

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            return { success: false, error: err.message || `HTTP ${res.status}: ${res.statusText}` }
        }

        const data = await res.json()
        return { success: true, cart: mapCartResponse(data) }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Network error occurred' }
    }
}

export async function deleteCartItemAPI(itemId: number): Promise<{ success: boolean; cart?: BackendCart; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                ...getAuthHeaders(),
            },
        })

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            return { success: false, error: err.message || `HTTP ${res.status}: ${res.statusText}` }
        }

        const data = await res.json()
        return { success: true, cart: mapCartResponse(data) }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Network error occurred' }
    }
}

export async function clearCartAPI(): Promise<{ success: boolean; cart?: BackendCart; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/cart`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                ...getAuthHeaders(),
            },
        })

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            return { success: false, error: err.message || `HTTP ${res.status}: ${res.statusText}` }
        }

        const data = await res.json()
        return { success: true, cart: mapCartResponse(data) }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Network error occurred' }
    }
}
export async function fetchOrderByIdAPI(orderId: number | string): Promise<{ success: boolean; order?: BackendOrder; error?: string }> {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
        const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        })

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            return { success: false, error: err.message || `HTTP ${res.status}: ${res.statusText}` }
        }

        const data = await res.json()
        const responseData = data?.data || data
        return { success: true, order: responseData }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Network error occurred' }
    }
}

export async function fetchCustomerByIdAPI(customerId: number | string): Promise<CustomerResponse> {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
        const res = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        })

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            return { success: false, error: err.message || err.error || `HTTP ${res.status}: ${res.statusText}` }
        }

        const data = await res.json()
        const responseData = data?.data || data
        const customer = responseData?.customer || responseData
        return { success: true, customer }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Network error occurred' }
    }
}

export async function updateCustomerAPI(customerId: number | string, updates: CustomerUpdateRequest): Promise<CustomerResponse> {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
        const res = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(updates),
        })

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            return { success: false, error: err.message || err.error || `HTTP ${res.status}: ${res.statusText}` }
        }

        const data = await res.json()
        const responseData = data?.data || data
        const customer = responseData?.customer || responseData
        return { success: true, customer }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Network error occurred' }
    }
}
