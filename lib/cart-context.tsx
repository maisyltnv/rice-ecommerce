"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import type { Product, CartItem } from "./types"
import { useAuth } from "./auth-context"
import {
  fetchCartAPI,
  addCartItemAPI,
  updateCartItemAPI,
  deleteCartItemAPI,
  clearCartAPI,
  type BackendCart,
  type BackendCartItem,
} from "./api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

const resolveImagePath = (imagePath?: string) => {
  if (!imagePath) return "/noimage.png"
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath
  if (imagePath.startsWith("/uploads")) return `${API_BASE_URL}${imagePath}`
  if (imagePath.startsWith("/")) return imagePath
  return `/${imagePath}`
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity: number }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "UPDATE_QUANTITY"; productId: number; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; items: CartItem[] }

interface CartContextType extends CartState {
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.product.id === action.product.id)

      let newItems: CartItem[]
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.product.id === action.product.id ? { ...item, quantity: item.quantity + action.quantity } : item,
        )
      } else {
        newItems = [...state.items, { product: action.product, quantity: action.quantity }]
      }

      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { items: newItems, total, itemCount }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.product.id !== action.productId)
      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { items: newItems, total, itemCount }
    }

    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", productId: action.productId })
      }

      const newItems = state.items.map((item) =>
        item.product.id === action.productId ? { ...item, quantity: action.quantity } : item,
      )
      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { items: newItems, total, itemCount }
    }

    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0 }

    case "LOAD_CART": {
      const total = action.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      const itemCount = action.items.reduce((sum, item) => sum + item.quantity, 0)
      return { items: action.items, total, itemCount }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  })
  const { isAuthenticated } = useAuth()

  const createProductFromSnapshot = useCallback((item: BackendCartItem): Product => {
    return {
      id: item.product_id,
      name: item.product_name,
      description: "",
      price: item.unit_price,
      image: resolveImagePath(item.product_image),
      images: item.product_image ? [resolveImagePath(item.product_image)] : [],
      category: "",
      inStock: true,
      weight: "",
      origin: "",
      grainType: "medium",
      cookingTime: 0,
      nutritionFacts: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fiber: 0,
      },
      features: [],
    }
  }, [])

  const mapBackendCart = useCallback(
    (cart?: BackendCart | null): CartItem[] => {
      if (!cart) return []
      return cart.items.map((item) => ({
        product: createProductFromSnapshot(item),
        quantity: item.quantity,
        backendId: item.id,
      }))
    },
    [createProductFromSnapshot],
  )

  const loadLocalCart = useCallback(() => {
    const savedCart = localStorage.getItem("rice-cart")
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", items })
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  const loadRemoteCart = useCallback(async () => {
    const response = await fetchCartAPI()
    if (response.success && response.cart) {
      dispatch({ type: "LOAD_CART", items: mapBackendCart(response.cart) })
    } else if (response.error) {
      console.error("Failed to load cart from API:", response.error)
    }
  }, [mapBackendCart])

  useEffect(() => {
    if (isAuthenticated) {
      void loadRemoteCart()
    } else {
      loadLocalCart()
    }
  }, [isAuthenticated, loadLocalCart, loadRemoteCart])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("rice-cart", JSON.stringify(state.items))
    }
  }, [state.items, isAuthenticated])

  const addItem = (product: Product, quantity: number) => {
    if (isAuthenticated) {
      void (async () => {
        const response = await addCartItemAPI(product.id, quantity)
        if (response.success && response.cart) {
          dispatch({ type: "LOAD_CART", items: mapBackendCart(response.cart) })
        } else if (response.error) {
          console.error("Failed to add cart item:", response.error)
        }
      })()
    } else {
      dispatch({ type: "ADD_ITEM", product, quantity })
    }
  }

  const removeItem = (productId: number) => {
    if (isAuthenticated) {
      const existing = state.items.find((item) => item.product.id === productId)
      if (!existing?.backendId) return

      void (async () => {
        const response = await deleteCartItemAPI(existing.backendId!)
        if (response.success && response.cart) {
          dispatch({ type: "LOAD_CART", items: mapBackendCart(response.cart) })
        } else if (response.error) {
          console.error("Failed to remove cart item:", response.error)
        }
      })()
    } else {
      dispatch({ type: "REMOVE_ITEM", productId })
    }
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (isAuthenticated) {
      const existing = state.items.find((item) => item.product.id === productId)
      if (!existing?.backendId) return

      void (async () => {
        const response = await updateCartItemAPI(existing.backendId!, quantity)
        if (response.success && response.cart) {
          dispatch({ type: "LOAD_CART", items: mapBackendCart(response.cart) })
        } else if (response.error) {
          console.error("Failed to update cart item:", response.error)
        }
      })()
    } else {
      dispatch({ type: "UPDATE_QUANTITY", productId, quantity })
    }
  }

  const clearCart = () => {
    if (isAuthenticated) {
      void (async () => {
        const response = await clearCartAPI()
        if (response.success && response.cart) {
          dispatch({ type: "LOAD_CART", items: mapBackendCart(response.cart) })
        } else if (response.success) {
          dispatch({ type: "CLEAR_CART" })
        } else if (response.error) {
          console.error("Failed to clear cart:", response.error)
        }
      })()
    } else {
      dispatch({ type: "CLEAR_CART" })
    }
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
