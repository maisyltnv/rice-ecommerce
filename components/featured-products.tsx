import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/add-to-cart-button"

const featuredProducts = [
  {
    id: 1,
    name: "Himalayan Basmati",
    description: "Aromatic long-grain rice with delicate flavor",
    price: 24.99,
    originalPrice: 29.99,
    image: "/basmati-rice-grains-in-elegant-bowl.jpg",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Japanese Short Grain",
    description: "Perfect for sushi and traditional dishes",
    price: 32.99,
    image: "/japanese-short-grain-rice-in-wooden-bowl.jpg",
    badge: "Premium",
  },
  {
    id: 3,
    name: "Wild Rice Blend",
    description: "Nutritious mix of wild and brown rice",
    price: 19.99,
    image: "/wild-rice-blend-in-rustic-bowl.jpg",
    badge: "Organic",
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-foreground mb-4">Featured Rice Varieties</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked selections from our premium collection, each variety chosen for its exceptional quality and
            unique characteristics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{product.badge}</Badge>
                </div>
                <div className="p-6">
                  <h3 className="font-playfair text-xl font-semibold text-foreground mb-2">{product.name}</h3>
                  <p className="text-muted-foreground mb-4">{product.description}</p>
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

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}
