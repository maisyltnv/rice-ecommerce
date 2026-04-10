"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Truck, CreditCard, Download } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const paymentIntentId = searchParams.get("payment_intent")
  const orderNumber = orderId?.replace("ORD-", "RC") || `RC${Date.now().toString().slice(-6)}`
  const { clearCart } = useCart()

  // Clear cart when success page loads (ensures cart is cleared even if checkout page didn't clear it)
  useEffect(() => {
    if (orderId) {
      // Clear cart when we have an order ID (indicating successful payment)
      clearCart()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]) // Run when orderId is available

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="font-playfair text-3xl font-bold text-foreground mb-4">ຊຳລະເງິນສຳເລັດ!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            ຂອບໃຈທີ່ທ່ານເລືອກຊື້. ຄຳສັ່ງຊື້ຂອງທ່ານໄດ້ຖືກສົ່ງສຳເລັດແລະການຊຳລະເງິນໄດ້ຖືກປະມວນຜົນແລ້ວ.
          </p>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="text-left space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">ລາຍລະອຽດຄຳສັ່ງຊື້</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">ເລກທີຄຳສັ່ງຊື້</p>
                      <p className="font-medium">#{orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ເລກທີການຊຳລະເງິນ</p>
                      <p className="font-medium font-mono text-xs">{paymentIntentId || orderId || "N/A"}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-2">ການຢືນຢັນຖືກສົ່ງໄປຍັງທີ່ຢູ່ອີເມວຂອງທ່ານ</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div className="flex items-start space-x-3">
                    <CreditCard className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-foreground">ການຊຳລະເງິນຖືກຢືນຢັນ</h4>
                      <p className="text-sm text-muted-foreground">ການຊຳລະເງິນຂອງທ່ານໄດ້ຖືກປະມວນຜົນສຳເລັດແລ້ວ</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Package className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium text-foreground">ກຳລັງປະມວນຜົນ</h4>
                      <p className="text-sm text-muted-foreground">ຄຳສັ່ງຊື້ຂອງທ່ານກຳລັງຖືກກຽມສົ່ງ</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Truck className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium text-foreground">ການຈັດສົ່ງ</h4>
                      <p className="text-sm text-muted-foreground">ຄາດວ່າຈະຈັດສົ່ງໃນ 3-5 ວັນທຳການ</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Button variant="outline" size="lg">
              <Download className="mr-2 h-4 w-4" />
              ດາວໂຫຼດໃບຮັບ
            </Button>
            <Link href="/orders">
              <Button variant="outline" size="lg" className="w-full bg-transparent">
                <Package className="mr-2 h-4 w-4" />
                ຕິດຕາມຄຳສັ່ງຊື້
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" className="w-full">
                ຊື້ຕໍ່
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <Link href="/">
              <Button variant="ghost" size="lg">
                ກັບໄປໜ້າຫຼັກ
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
