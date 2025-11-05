"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { products } from "@/lib/data"
import { useCart } from "@/lib/cart-context"
import { Minus, Plus, ShoppingCart, Heart, Share2, Clock, MapPin, Check } from "lucide-react"
import Link from "next/link"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number.parseInt(params.id as string)
  const product = products.find((p) => p.id === productId)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const { addItem } = useCart()

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">ບໍ່ພົບສິນຄ້າ</h1>
            <Link href="/products">
              <Button>ຍ້ອນກັບໜ້າສິນຄ້າ</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)

  const handleAddToCart = () => {
    addItem(product, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 overflow-x-auto">
            <Link href="/" className="hover:text-foreground whitespace-nowrap">
              ໜ້າຫຼັກ
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground whitespace-nowrap">
              ສິນຄ້າ
            </Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
            {/* Product Images */}
            <div>
              <div className="mb-4">
                <img
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 ${selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {product.badge && <Badge className="mb-4 bg-primary text-primary-foreground">{product.badge}</Badge>}
              <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-foreground mb-4">{product.name}</h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-6">{product.description}</p>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-foreground">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg sm:text-xl text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-muted-foreground">ແຫຼ່ງກຳເນີດ: {product.origin}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-muted-foreground">ເວລາຕົ້ມ: {product.cookingTime} ນາທີ</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
                <span className="text-sm font-medium">ຈຳນວນ:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-9"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                  <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)} className="h-9">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="flex-1" disabled={!product.inStock} onClick={handleAddToCart}>
                  {isAdded ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      ເພີ່ມໃສ່ກະຕ່າແລ້ວ!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {product.inStock ? `ເພີ່ມໃສ່ກະຕ່າ - $${(product.price * quantity).toFixed(2)}` : "ສິນຄ້າໝົດ"}
                    </>
                  )}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="mr-2 h-4 w-4" />
                  ບັນທຶກ
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="mr-2 h-4 w-4" />
                  ແບ່ງປັນ
                </Button>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold mb-3">ຈຸດເດັ່ນ</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="nutrition" className="mb-16">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="nutrition">ຂໍ້ມູນໂພຊະນາການ</TabsTrigger>
              <TabsTrigger value="cooking">ຄູ່ມືການຕົ້ມ</TabsTrigger>
              <TabsTrigger value="storage">ເກັບຮັກສາ</TabsTrigger>
            </TabsList>
            <TabsContent value="nutrition" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">ຂໍ້ມູນໂພຊະນາການ (ຕໍ່ 100g ສຸກ)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{product.nutritionFacts.calories}</div>
                      <div className="text-sm text-muted-foreground">ແຄລໍລີ</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{product.nutritionFacts.protein}g</div>
                      <div className="text-sm text-muted-foreground">ໂປຣຕີນ</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{product.nutritionFacts.carbs}g</div>
                      <div className="text-sm text-muted-foreground">ຄາບໂບໄຮເດຣດ</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{product.nutritionFacts.fiber}g</div>
                      <div className="text-sm text-muted-foreground">ໃຍອາຫານ</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="cooking" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">ຄູ່ມືຕົ້ມໃຫ້ອົບອຸ່ນ</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">ສັດສ່ວນ ເຂົ້າ : ນ້ຳ</h4>
                      <p className="text-muted-foreground">
                        ເຂົ້າ 1 ຖ້ວຍ : ນ້ຳ 1.5 ຖ້ວຍ (ປັບຕາມຄວາມນຸ່ມທີ່ຕ້ອງການ)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">ຂັ້ນຕອນການຕົ້ມ</h4>
                      <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li>ລ້າງເຂົ້າຈົນນ້ຳໃສ</li>
                        <li>ໃສ່ເຂົ້າກັບນ້ຳລົງໃນຫມໍ້</li>
                        <li>ຕ້ມໃຫ້ເດືອດ ແລ້ວຫຼຸດໄຟໃຫ້ອ່ອນ</li>
                        <li>ປິດຝາ ແລະຕົ້ມຕໍ່ {product.cookingTime} ນາທີ</li>
                        <li>ພັກ 5 ນາທີ ແລ້ວຄຸກໃຫ້ຟູ</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="storage" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">ຄຳແນະນຳການເກັບຮັກສາ</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">ບໍ່ແກະກ່ອງ</h4>
                      <p className="text-muted-foreground">ເກັບໄວ້ໃນທີ່ເຢັນແຫ້ງໄດ້ຖືງ 2 ປີ</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">ຫຼັງເປີດໃຊ້</h4>
                      <p className="text-muted-foreground">
                        ເທໄປໃສ່ພາຊະນະປິດສະນິດ ແລະໃຊ້ໃນ 6 ເດືອນ ເພື່ອຄຸນນະພາບທີ່ດີ
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">ເຂົ້າສຸກ</h4>
                      <p className="text-muted-foreground">ແຊ່ຕູ້ເຢັນໄດ້ເຖິງ 4 ມື້ ຫຼືແຊ່ແຂງໄດ້ເຖິງ 6 ເດືອນ</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-8">ອາດຈະຖືກໃຈທ່ານອີກ</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProducts.map((relatedProduct) => (
                  <Card key={relatedProduct.id} className="group hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      <Link href={`/products/${relatedProduct.id}`}>
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={relatedProduct.image || "/placeholder.svg"}
                            alt={relatedProduct.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {relatedProduct.badge && (
                            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                              {relatedProduct.badge}
                            </Badge>
                          )}
                        </div>
                      </Link>
                      <div className="p-4">
                        <Link href={`/products/${relatedProduct.id}`}>
                          <h3 className="font-playfair text-lg font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                            {relatedProduct.name}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-foreground">${relatedProduct.price}</span>
                          <Button size="sm">ເພີ່ມໃສ່ກະຕ່າ</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
