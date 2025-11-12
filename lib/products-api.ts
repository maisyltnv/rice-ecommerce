const API_BASE_URL = "/api"

export interface Product {
    id: number
    name: string
    price: number
    description?: string
    image?: string
    category?: string | { id: number; name: string; description?: string }
    category_id?: number
    stock?: number
    created_at?: string
    updated_at?: string
}

export interface CreateProductRequest {
    name: string
    price: number
    description?: string
    // When creating, allow uploading a file or passing an existing URL/path
    image?: File | string
    category?: string
    category_id?: number | null
    // Some backends expect camelCase - send both for compatibility
    categoryId?: number | null
    stock?: number
}

export interface UpdateProductRequest {
    name?: string
    price?: number
    description?: string
    // For updates, allow file upload or keep existing string path
    image?: File | string | null
    category?: string
    category_id?: number | null
    // Some backends expect camelCase - send both for compatibility
    categoryId?: number | null
    stock?: number
}

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// Get all products
export async function getAllProducts(): Promise<ApiResponse<Product[]>> {
    try {
        console.log('Fetching all products from:', `${API_BASE_URL}/products`)

        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            mode: 'cors',
        })

        console.log('Response status:', response.status)
        console.log('Response ok:', response.ok)

        if (!response.ok) {
            const errorText = await response.text()
            console.log('Error response:', errorText)
            let errorData: any = {}
            try {
                errorData = JSON.parse(errorText)
            } catch (e) {
                console.log('Could not parse error response as JSON')
            }
            return {
                success: false,
                error: errorData.message || `HTTP ${response.status}: ${response.statusText}`
            }
        }

        const data = await response.json()
        console.log('Products fetched successfully:', data)

        return {
            success: true,
            data: data.data || [],
            message: 'Products fetched successfully'
        }
    } catch (error) {
        console.error('Error fetching products:', error)
        console.error('Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace'
        })
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error occurred'
        }
    }
}

// Get single product
export async function getProduct(id: number): Promise<ApiResponse<Product>> {
    try {
        console.log('Fetching product:', `${API_BASE_URL}/products/${id}`)

        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
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
        console.log('Product fetched successfully:', data)

        return {
            success: true,
            data: data,
            message: 'Product fetched successfully'
        }
    } catch (error) {
        console.error('Error fetching product:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error occurred'
        }
    }
}

// Create product
export async function createProduct(product: CreateProductRequest): Promise<ApiResponse<Product>> {
    try {
        console.log('Creating product (multipart):', `${API_BASE_URL}/products`)
        const token = localStorage.getItem('auth-token')

        // Always use FormData to support file uploads
        const formData = new FormData()
        formData.append('name', product.name)
        formData.append('price', product.price.toString())
        if (product.description) formData.append('description', product.description)
        if (product.stock !== undefined) formData.append('stock', String(product.stock))
        const categoryIdVal = product.categoryId ?? product.category_id
        if (categoryIdVal !== undefined && categoryIdVal !== null) {
            formData.append('category_id', String(categoryIdVal))
        }
        if (product.image instanceof File) {
            formData.append('image', product.image)
        } else if (typeof product.image === 'string' && product.image) {
            // If backend supports passing an existing image path
            formData.append('image', product.image)
        }

        const headers: HeadersInit = {
            // Do NOT set Content-Type for FormData; browser will set boundary
            'Accept': 'application/json',
        }
        if (token) headers['Authorization'] = `Bearer ${token}`

        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers,
            body: formData,
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
        console.log('Product created successfully:', data)

        return {
            success: true,
            data: data,
            message: 'Product created successfully'
        }
    } catch (error) {
        console.error('Error creating product:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error occurred'
        }
    }
}

// Update product
export async function updateProduct(id: number, product: UpdateProductRequest): Promise<ApiResponse<Product>> {
    try {
        console.log('Updating product (multipart):', `${API_BASE_URL}/products/${id}`)

        const token = localStorage.getItem('auth-token')

        // Use FormData to support optional image updates
        const formData = new FormData()
        if (product.name !== undefined) formData.append('name', product.name)
        if (product.price !== undefined) formData.append('price', String(product.price))
        if (product.description !== undefined && product.description !== null) {
            formData.append('description', product.description)
        }
        if (product.stock !== undefined) formData.append('stock', String(product.stock))
        const categoryIdVal = product.categoryId ?? product.category_id
        if (categoryIdVal !== undefined && categoryIdVal !== null) {
            formData.append('category_id', String(categoryIdVal))
        }
        if (product.image instanceof File) {
            formData.append('image', product.image)
        } else if (product.image === null) {
            // Optional: explicitly clear image if backend supports it
            formData.append('image', '')
        } else if (typeof product.image === 'string' && product.image) {
            formData.append('image', product.image)
        }

        const headers: HeadersInit = {
            'Accept': 'application/json',
        }
        if (token) headers['Authorization'] = `Bearer ${token}`

        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers,
            body: formData,
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
        console.log('Product updated successfully:', data)

        return {
            success: true,
            data: data,
            message: 'Product updated successfully'
        }
    } catch (error) {
        console.error('Error updating product:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error occurred'
        }
    }
}

// Delete product
export async function deleteProduct(id: number): Promise<ApiResponse<void>> {
    try {
        console.log('Deleting product:', `${API_BASE_URL}/products/${id}`)

        const token = localStorage.getItem('auth-token')
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
            headers,
            mode: 'cors',
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return {
                success: false,
                error: errorData.message || `HTTP ${response.status}: ${response.statusText}`
            }
        }

        console.log('Product deleted successfully')

        return {
            success: true,
            message: 'Product deleted successfully'
        }
    } catch (error) {
        console.error('Error deleting product:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error occurred'
        }
    }
}
