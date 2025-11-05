"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { products, categories } from "@/lib/data"
import Link from "next/link"

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const filteredProducts = products.filter(
    (product) => selectedCategory === "all" || product.category === selectedCategory,
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
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
          <div className="text-center mb-12">
            <h1 className="font-playfair text-4xl font-bold text-foreground mb-4">ສູນລວມຂ້າວຊັ້ນດີ</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ພວກເຮົາໄດ້ຄັດສັນຂ້າວຊັ້ນນໍາຢ່າງພິຖີພິຖັນ ທົ່ວປະເທດລາວ.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
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
            {sortedProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.badge && (
                        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                          {product.badge}
                        </Badge>
                      )}
                      {!product.inStock && (
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
                    <p className="text-muted-foreground mb-2">{product.description}</p>
                    <p className="text-sm text-muted-foreground mb-4">Origin: {product.origin}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-foreground">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      <AddToCartButton productId={product.id} size="sm" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
