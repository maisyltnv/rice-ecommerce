export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  category: string
  badge?: string
  inStock: boolean
  weight: string
  origin: string
  grainType: "long" | "medium" | "short"
  cookingTime: number
  nutritionFacts: {
    calories: number
    protein: number
    carbs: number
    fiber: number
  }
  features: string[]
}

export interface CartItem {
  product: Product
  quantity: number
  backendId?: number
}

export interface User {
  id: string
  email: string
  name: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}
