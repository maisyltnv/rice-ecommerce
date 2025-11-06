"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { getAllProducts, type Product } from "@/lib/products-api"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

// API base URL for image URLs (can be configured via environment variable)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setLoading(true)
      const res = await getAllProducts()
      if (isMounted && res.success && res.data) {
        setProducts(res.data)
      }
      setLoading(false)
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  const getCategoryKey = (p: Product): string => {
    if (!p) return "uncategorized"
    if (typeof p.category === "object" && p.category?.id != null) return p.category.id.toString()
    if (typeof p.category === "string" && p.category.trim() !== "") return p.category
    if (p.category_id != null) return p.category_id.toString()
    return "uncategorized"
  }

  const getCategoryLabel = (p: Product): string => {
    if (typeof p.category === "object") return p.category?.name || "ບໍ່ມີໝວດໝູ່"
    if (typeof p.category === "string" && p.category.trim() !== "") return p.category
    return "ບໍ່ມີໝວດໝູ່"
  }

  const categoryOptions = useMemo(() => {
    const counts: Record<string, { id: string; name: string; count: number }> = {}
    for (const p of products) {
      const key = getCategoryKey(p)
      const name = getCategoryLabel(p)
      counts[key] = counts[key]
        ? { ...counts[key], count: counts[key].count + 1 }
        : { id: key, name, count: 1 }
    }
    return [{ id: "all", name: "ທັງໝົດ", count: products.length }, ...Object.values(counts)]
  }, [products])

  const filteredProducts = products.filter((product) =>
    selectedCategory === "all" ? true : getCategoryKey(product) === selectedCategory,
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return (a.name || "").localeCompare(b.name || "")
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-foreground mb-4">ສູນລວມເຂົ້າຊັ້ນດີ</h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              ພວກເຮົາໄດ້ຄັດສັນເຂົ້າຊັ້ນນໍາຢ່າງພິຖີພິຖັນ ທົ່ວປະເທດລາວ.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={sortBy}
                onChange={(value) => setSortBy(value.toString())}
                options={[
                  { value: "name", label: "ຊື່ A-Z" },
                  { value: "price-low", label: "ລາຄາ: ຕ່ຳ → ສູງ" },
                  { value: "price-high", label: "ລາຄາ: ສູງ → ຕ່ຳ" }
                ]}
                placeholder="ຈັດຮຽງຕາມ"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product) => {
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

              return (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <Link href={`/products/${product.id}`}>
                      <div className="relative overflow-hidden rounded-t-lg bg-gray-100">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name || "product"}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback to noimage.png if image fails to load
                            const target = e.target as HTMLImageElement
                            target.src = "/noimage.png"
                          }}
                        />
                        {/* API may not provide these fields; hide when not present */}
                        {false && (
                          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">

                          </Badge>
                        )}
                        {false && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive">ສິນຄ້າໝົດ</Badge>
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-6">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-playfair text-xl font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      {product.description && (
                        <p className="text-muted-foreground mb-2">{product.description}</p>
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
              )
            })}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">ບໍ່ພົບສິນຄ້າໃນປະເພດນີ້.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
