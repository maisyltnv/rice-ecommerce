"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { getAllProducts, type Product } from "@/lib/products-api"
import { formatPrice } from "@/lib/utils"

// API base URL for image URLs (can be configured via environment variable)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const loadProducts = async () => {
      setLoading(true)
      const result = await getAllProducts()
      if (isMounted && result.success && result.data) {
        // Show first 3 products as featured, or limit to 6
        setProducts(result.data.slice(0, 6))
      }
      setLoading(false)
    }
    loadProducts()
    return () => {
      isMounted = false
    }
  }, [])

  // Construct image URL - handle both absolute and relative paths
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return "/noimage.png"
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath
    }
    // If it starts with /uploads, it's likely from the backend
    if (imagePath.startsWith("/uploads")) {
      return `${API_BASE_URL}${imagePath}`
    }
    // If it starts with /, it's a relative path from public folder
    if (imagePath.startsWith("/")) {
      return imagePath
    }
    // Otherwise, treat as relative path
    return `/${imagePath}`
  }

  if (loading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-foreground mb-4">ສິນຄ້າແນະນຳ</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ຄັດສັນຢ່າງຕັ້ງໃຈຈາກຄັງເຂົ້າຊັ້ນດີ ແຕ່ລະຊະນິດໂດດເດັ່ນດ້ວຍຄຸນນະພາບ.
            </p>
          </div>
          <div className="text-center text-muted-foreground">ກຳລັງໂຫຼດສິນຄ້າ...</div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-foreground mb-4">ສິນຄ້າແນະນຳ</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ຄັດສັນຢ່າງຕັ້ງໃຈຈາກຄັງເຂົ້າຊັ້ນດີ ແຕ່ລະຊະນິດໂດດເດັ່ນດ້ວຍຄຸນນະພາບ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg bg-gray-100">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name || "Product image"}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to noimage.png if image fails to load
                      const target = e.target as HTMLImageElement
                      target.src = "/noimage.png"
                    }}
                  />
                  {/* Badge can be added if product has a badge field or category */}
                  {product.category && (
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                      {typeof product.category === 'string'
                        ? product.category
                        : product.category?.name || "ສິນຄ້າ"}
                    </Badge>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-playfair text-xl font-semibold text-foreground mb-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-muted-foreground mb-4">{product.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-foreground">{formatPrice(product.price)}</span>
                    </div>
                    <AddToCartButton productId={product.id} product={product} size="sm" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button variant="outline" size="lg">
              ເບິ່ງສິນຄ້າທັງໝົດ
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
