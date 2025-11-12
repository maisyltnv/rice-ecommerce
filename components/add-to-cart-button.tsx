"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { products } from "@/lib/data"
import type { Product as ApiProduct } from "@/lib/products-api"

interface AddToCartButtonProps {
  productId: number
  product?: ApiProduct
  quantity?: number
  size?: "sm" | "default" | "lg"
  className?: string
}

export function AddToCartButton({ productId, product: productProp, quantity = 1, size = "default", className }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useCart()

  // Use provided product or try to find in static products array
  const staticProduct = products.find((p) => p.id === productId)
  const product = productProp || staticProduct

  // If no product found, still show button but use minimal product info
  if (!product) {
    // Create a minimal product object from the ID for cart functionality
    const minimalProduct = {
      id: productId,
      name: `Product ${productId}`,
      price: 0,
      description: ""
    }
    
    const handleAddToCart = () => {
      addItem(minimalProduct as any, quantity)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    }

    return (
      <Button size={size} onClick={handleAddToCart} className={className}>
        {isAdded ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            ເພີ່ມແລ້ວ!
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            ເພີ່ມໃສ່ກະຕ່າ
          </>
        )}
      </Button>
    )
  }

  const handleAddToCart = () => {
    // Convert API product to cart-compatible format
    const cartProduct = {
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: product.price,
      originalPrice: undefined,
      image: product.image,
      category: typeof product.category === 'string' ? product.category : product.category?.name || "",
      stock: product.stock
    }
    addItem(cartProduct as any, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  // Check stock availability (for API products, stock might be undefined or 0)
  const isOutOfStock = 'inStock' in product ? !product.inStock : (product.stock !== undefined && product.stock <= 0)
  
  if (isOutOfStock) {
    return (
      <Button size={size} disabled className={className}>
        ສິນຄ້າໝົດ
      </Button>
    )
  }

  return (
    <Button size={size} onClick={handleAddToCart} className={className}>
      {isAdded ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          ເພີ່ມແລ້ວ!
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          ເພີ່ມໃສ່ກະຕ່າ
        </>
      )}
    </Button>
  )
}
