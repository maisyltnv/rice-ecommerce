const API_BASE_URL = "/api"

export interface Product {
    id: number
    name: string
    price: number
    description?: string
    image?: string
    category?: string
    stock?: number
    created_at?: string
    updated_at?: string
}

export interface CreateProductRequest {
    name: string
    price: number
    description?: string
    image?: string
    category?: string
    stock?: number
}

export interface UpdateProductRequest {
    name?: string
    price?: number
    description?: string
    image?: string
    category?: string
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
        console.log('Creating product:', `${API_BASE_URL}/products`)
        console.log('Product data:', product)

        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(product),
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
        console.log('Updating product:', `${API_BASE_URL}/products/${id}`)
        console.log('Update data:', product)

        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(product),
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

        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
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
