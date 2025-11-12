"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-playfair text-3xl font-bold text-foreground mb-4">ກະຕ່າຂອງທ່ານວ່າງເປົ່າ</h1>
            <p className="text-lg text-muted-foreground mb-8">
              ຄົ້ນພົບຄັງຂ້າວຊັ້ນດີ ແລະເພີ່ມຊະນິດອີ່ມ່ອນໃສ່ກະຕ່າຂອງທ່ານ.
            </p>
            <Link href="/products">
              <Button size="lg">ໄປໜ້າສິນຄ້າ</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const shippingCost = total >= 50 ? 0 : 5.99
  const tax = 0
  const orderTotal = total + shippingCost + tax

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-4">
        <div className="container mx-auto px-2 sm:px-2 lg:px-2">
          <div className="mb-6 sm:mb-8">
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-foreground mb-2">ກະຕ່າສິນຄ້າ</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {items.length} ລາຍການໃນກະຕ່າຂອງທ່ານ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-4">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-2">
              {items.map((item) => (
                <Card key={item.product.id}>
                  <CardContent className="px-3 py-3 sm:px-4 sm:py-0">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 self-center sm:self-start">
                        <img
                          src={item.product.image || "/noimage.png"}
                          alt={item.product.name}
                          className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/noimage.png"
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.product.id}`}>
                          <h3 className="font-playfair text-base sm:text-lg font-semibold text-foreground hover:text-primary transition-colors mb-2">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{item.product.description}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2">Weight: {item.product.weight}</p>

                        {/* Mobile: Quantity and Price Row */}
                        <div className="flex flex-col sm:hidden gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">ຈຳນວນ:</span>
                            <div className="flex items-center border border-border rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-2 py-1 text-center min-w-[2rem] text-sm">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.product.id)}
                              className="text-destructive hover:text-destructive h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-xs text-muted-foreground">{formatPrice(item.product.price)} ຕໍ່ຊິ້ນ</div>
                        </div>
                      </div>

                      {/* Desktop: Quantity, Price, Remove */}
                      <div className="hidden sm:flex items-center space-x-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 py-2 text-center min-w-[3rem]">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {/* Price */}
                        <div className="text-right min-w-[80px]">
                          <div className="font-semibold text-foreground">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                          <div className="text-xs text-muted-foreground">{formatPrice(item.product.price)} ຕໍ່ຊິ້ນ</div>
                        </div>
                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4">
                <Button variant="outline" onClick={clearCart} className="w-full sm:w-auto">
                  ລ້າງກະຕ່າ
                </Button>
                <Link href="/products" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto">ຊື້ຕໍ່</Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="lg:sticky lg:top-24">
                <CardContent className="p-4 sm:p-6">
                  <h2 className="font-playfair text-xl font-semibold text-foreground mb-4">ສະຫລຸບຄຳສັ່ງຊື້</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ລາຄາ</span>
                      <span className="font-medium">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ຄ່າສົ່ງ</span>
                      <span className="font-medium">{shippingCost === 0 ? "ຟຣີ" : formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ອາກອນ</span>
                      <span className="font-medium">{formatPrice(tax)}</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-foreground">ລວມທັງໝົດ</span>
                        <span className="text-lg font-semibold text-foreground">
                          {formatPrice(orderTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {shippingCost > 0 && (
                    <div className="bg-accent/50 p-3 rounded-lg mb-6">
                      <p className="text-sm text-accent-foreground">
                        ເພີ່ມອີກ {formatPrice(50 - total)} ເພື່ອສົ່ງຟຣີ!
                      </p>
                    </div>
                  )}

                  <Link href="/checkout">
                    <Button size="lg" className="w-full">
                      ດຳເນີນການຈ່າຍເງິນ
                    </Button>
                  </Link>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      ຊ່ອງທາງຈ່າຍເງິນປອດໄພ ດ້ວຍການເຂົ້າລະຫັດມາດຕະຖານສາກົນ
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}