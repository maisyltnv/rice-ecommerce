"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCart } from "@/lib/cart-context"
import { Truck, AlertCircle, CheckCircle, Lock, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import type { Order } from "@/lib/admin-data"
import { createOrderAPI, type OrderItemPayload } from "@/lib/api"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<"shipping" | "payment" | "processing">("shipping")
  const [paymentError, setPaymentError] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "LA",
  })

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-playfair text-3xl font-bold text-foreground mb-4">ບໍ່ມີລາຍການໃຫ້ຈ່າຍເງິນ</h1>
            <p className="text-lg text-muted-foreground mb-8">ກະຕ່າຂອງທ່ານວ່າງເປົ່າ. ເພີ່ມສິນຄ້າກ່ອນ.</p>
            <Link href="/products">
              <Button size="lg">ໄປໜ້າສິນຄ້າ</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const subtotal = total
  const shipping = total >= 50 ? 0 : 5.99
  const tax = total * 0.08
  const finalTotal = subtotal + shipping + tax

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep("payment")
  }

  const handleSaveOrder = async () => {
    setIsSaving(true)
    setPaymentError("")

    try {
      const orderItems: OrderItemPayload[] = items.map(i => ({
        product_id: i.product.id,
        quantity: i.quantity,
      }))

      const createRes = await createOrderAPI(orderItems)
      if (!createRes.success || !createRes.order) {
        throw new Error(createRes.error || 'Create order failed')
      }

      const created = createRes.order
      const orderId = created.id?.toString() || `ORD-${Date.now()}`

      setPaymentSuccess(true)
      setCurrentStep("processing")

      setTimeout(() => {
        clearCart()
        router.push(`/checkout/success?order_id=${orderId}`)
      }, 1200)
    } catch (error) {
      setPaymentError("Failed to save order. Please try again.")
      console.error("Error saving order:", error)
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-foreground mb-4">ຊຳລະເງິນ</h1>
            <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm overflow-x-auto pb-2">
              <span className={currentStep === "shipping" ? "text-primary font-medium whitespace-nowrap" : "text-muted-foreground whitespace-nowrap"}>
                1. ຈັດສົ່ງ
              </span>
              <span className="text-muted-foreground">→</span>
              <span className={currentStep === "payment" ? "text-primary font-medium whitespace-nowrap" : "text-muted-foreground whitespace-nowrap"}>
                2. ຊຳລະເງິນ
              </span>
              <span className="text-muted-foreground">→</span>
              <span className={currentStep === "processing" ? "text-primary font-medium whitespace-nowrap" : "text-muted-foreground whitespace-nowrap"}>
                3. ສຳເລັດ
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Shipping Form */}
              {currentStep === "shipping" && (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>ຂໍ້ມູນຕິດຕໍ່</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">ອີເມວ</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Truck className="h-5 w-5" />
                        <span>ທີ່ຢູ່ຈັດສົ່ງ</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">ຊື່</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">ນາມສະກຸນ</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">ທີ່ຢູ່</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">ເມືອງ</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">ແຂວງ</Label>
                          <Select
                            value={formData.state}
                            onChange={(value) => handleInputChange("state", value.toString())}
                            options={[
                              { value: "AT", label: "ແຂວງ ອັດຕະປື" },
                              { value: "BK", label: "ແຂວງ ບໍ່ແກ້ວ" },
                              { value: "BL", label: "ແຂວງ ບໍລິຄໍາໄຊ" },
                              { value: "CH", label: "ແຂວງ ຈໍາປາສັກ" },
                              { value: "HO", label: "ແຂວງ ຫົວພັນ" },
                              { value: "KH", label: "ແຂວງ ຄໍາມ່ວນ" },
                              { value: "LN", label: "ແຂວງ ຫຼວງນໍ້າທາ" },
                              { value: "LP", label: "ແຂວງ ຫຼວງພະບາງ" },
                              { value: "OU", label: "ແຂວງ ອຸດົມໄຊ" },
                              { value: "PH", label: "ແຂວງ ຜົ້ງສາລີ" },
                              { value: "SK", label: "ແຂວງ ເຊກອງ" },
                              { value: "SL", label: "ແຂວງ ສາລະວັນ" },
                              { value: "SV", label: "ແຂວງ ສະຫວັນນະເຂດ" },
                              { value: "VT", label: "ນະຄອນຫຼວງວຽງຈັນ" },
                              { value: "VI", label: "ແຂວງ ວຽງຈັນ" },
                              { value: "XA", label: "ແຂວງ ຊຽງຂວາງ" },
                              { value: "XS", label: "ແຂວງ ໄຊສົມບູນ" },
                              { value: "XY", label: "ແຂວງ ໄຊຍະບູລີ" }
                            ]}
                            placeholder="ເລືອກແຂວງ"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ລະຫັດໄປສະນີ</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">ປະເທດ</Label>
                          <Select
                            value={formData.country}
                            onChange={(value) => handleInputChange("country", value.toString())}
                            options={[
                              { value: "LA", label: "ປະເທດລາວ" },
                            ]}
                            placeholder="ເລືອກປະເທດ"
                            disabled
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button type="submit" size="lg" className="w-full">
                    ໄປຫາການຊຳລະເງິນ
                  </Button>
                </form>
              )}

              {/* Payment Form */}
              {currentStep === "payment" && (
                <div className="space-y-6">
                  {paymentError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{paymentError}</AlertDescription>
                    </Alert>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Lock className="h-5 w-5" />
                        <span>Payment Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex justify-center">
                        <div className="relative w-full max-w-md">
                          <Image
                            src="/myQr.jpeg"
                            alt="QR Code for Payment"
                            width={400}
                            height={400}
                            className="w-full h-auto rounded-lg"
                            priority
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        className="w-full"
                        onClick={handleSaveOrder}
                        disabled={isSaving || paymentSuccess}
                      >
                        {isSaving || paymentSuccess ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Pay {formatPrice(finalTotal)}
                          </>
                        )}
                      </Button>

                      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        <span>Your payment information is secure and encrypted</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Button variant="outline" onClick={() => setCurrentStep("shipping")} className="w-full" type="button">
                    ກັບໄປໜ້າຈັດສົ່ງ
                  </Button>
                </div>
              )}

              {/* Processing */}
              {currentStep === "processing" && (
                <Card>
                  <CardContent className="p-12 text-center">
                    {paymentSuccess ? (
                      <>
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">ຊຳລະເງິນສຳເລັດ!</h3>
                        <p className="text-muted-foreground mb-4">ກຳລັງດຳເນີນຄຳສັ່ງຊື້ຂອງທ່ານ...</p>
                        <div className="flex items-center justify-center space-x-2">
                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                          <div
                            className="h-2 w-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="h-2 w-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">ກຳລັງປະມວນຜົນການຊຳລະ</h3>
                        <p className="text-muted-foreground">ກະລຸນາລໍຖ້າ ໃນຂະນະທີ່ລະບົບກຳລັງປະມວນຜົນ...</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="lg:sticky lg:top-24">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">ສະຫລຸບຄຳສັ່ງຊື້</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex items-center space-x-3">
                        <img
                          src={item.product.image || "/noimage.png"}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/noimage.png"
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-sm">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ລາຄາ</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ຄ່າສົ່ງ</span>
                      <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ອາກອນ</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>ລວມທັງໝົດ</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  {total < 50 && currentStep === "shipping" && (
                    <div className="bg-accent/50 p-3 rounded-lg mt-6">
                      <p className="text-sm text-accent-foreground">
                        Add {formatPrice(50 - total)} more for free shipping!
                      </p>
                    </div>
                  )}
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
