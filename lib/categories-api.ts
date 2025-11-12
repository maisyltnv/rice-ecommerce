const API_BASE_URL = "/api"

export interface Category {
    id: number
    name: string
    description?: string
    created_at?: string
    updated_at?: string
}

export interface CreateCategoryRequest {
    name: string
    description?: string
}

export interface UpdateCategoryRequest {
    name?: string
    description?: string
}

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// Get all categories
export async function getAllCategories(): Promise<ApiResponse<Category[]>> {
    try {
        console.log('Fetching all categories from:', `${API_BASE_URL}/categories`)

        const response = await fetch(`${API_BASE_URL}/categories`, {
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
        console.log('Categories fetched successfully:', data)

        return {
            success: true,
            data: data.data || [],
            message: 'Categories fetched successfully'
        }
    } catch (error) {
        console.error('Error fetching categories:', error)
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

// Get single category
export async function getCategory(id: number): Promise<ApiResponse<Category>> {
    try {
        console.log('Fetching category:', `${API_BASE_URL}/categories/${id}`)

        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
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
        console.log('Category fetched successfully:', data)

        return {
            success: true,
            data: data.data,
            message: 'Category fetched successfully'
        }
    } catch (error) {
        console.error('Error fetching category:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error occurred'
        }
    }
}

// Create category
export async function createCategory(category: CreateCategoryRequest): Promise<ApiResponse<Category>> {
    try {
        console.log('Creating category:', `${API_BASE_URL}/categories`)
        console.log('Category data:', category)

        const token = localStorage.getItem('auth-token')
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers,
            body: JSON.stringify(category),
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
        console.log('Category created successfully:', data)

        return {
            success: true,
            data: data.data,
            message: 'Category created successfully'
        }
    } catch (error) {
        console.error('Error creating category:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error occurred'
        }
    }
}

// Update category
export async function updateCategory(id: number, category: UpdateCategoryRequest): Promise<ApiResponse<Category>> {
    try {
        console.log('Updating category:', `${API_BASE_URL}/categories/${id}`)
        console.log('Update data:', category)

        const token = localStorage.getItem('auth-token')
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(category),
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
        console.log('Category updated successfully:', data)

        return {
            success: true,
            data: data.data,
            message: 'Category updated successfully'
        }
    } catch (error) {
        console.error('Error updating category:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error occurred'
        }
    }
}

// Delete category
export async function deleteCategory(id: number): Promise<ApiResponse<void>> {
    try {
        console.log('Deleting category:', `${API_BASE_URL}/categories/${id}`)

        const token = localStorage.getItem('auth-token')
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
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

        console.log('Category deleted successfully')

        return {
            success: true,
            message: 'Category deleted successfully'
        }
    } catch (error) {
        console.error('Error deleting category:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error occurred'
        }
    }
}
