"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"

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

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">ກະຕ່າສິນຄ້າ</h1>
            <p className="text-muted-foreground">
              {items.length} ລາຍການໃນກະຕ່າຂອງທ່ານ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.product.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.product.id}`}>
                          <h3 className="font-playfair text-lg font-semibold text-foreground hover:text-primary transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-2">{item.product.description}</p>
                        <p className="text-sm text-muted-foreground">Weight: {item.product.weight}</p>
                      </div>
                      <div className="flex items-center space-x-4">
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
                        <div className="text-right">
                          <div className="font-semibold text-foreground">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">${item.product.price} ຕໍ່ຊິ້ນ</div>
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

              <div className="flex justify-between items-center pt-4">
                <Button variant="outline" onClick={clearCart}>
                  ລ້າງກະຕ່າ
                </Button>
                <Link href="/products">
                  <Button variant="outline">ຊື້ຕໍ່</Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="font-playfair text-xl font-semibold text-foreground mb-4">ສະຫລຸບຄຳສັ່ງຊື້</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ລາຄາ</span>
                      <span className="font-medium">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ຄ່າສົ່ງ</span>
                      <span className="font-medium">{total >= 50 ? "ຟຣີ" : "$5.99"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ອາກອນ</span>
                      <span className="font-medium">${(total * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-foreground">ລວມທັງໝົດ</span>
                        <span className="text-lg font-semibold text-foreground">
                          ${(total + (total >= 50 ? 0 : 5.99) + total * 0.08).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {total < 50 && (
                    <div className="bg-accent/50 p-3 rounded-lg mb-6">
                      <p className="text-sm text-accent-foreground">
                        ເພີ່ມອີກ ${(50 - total).toFixed(2)} ເພື່ອສົ່ງຟຣີ!
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
