"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { products } from "@/lib/data"

interface AddToCartButtonProps {
  productId: number
  quantity?: number
  size?: "sm" | "default" | "lg"
  className?: string
}

export function AddToCartButton({ productId, quantity = 1, size = "default", className }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useCart()

  const product = products.find((p) => p.id === productId)

  if (!product) {
    return null
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  if (!product.inStock) {
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
