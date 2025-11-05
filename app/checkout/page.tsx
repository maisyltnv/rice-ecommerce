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
import { PaymentForm } from "@/components/payment-form"
import { useCart } from "@/lib/cart-context"
import { Truck, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<"shipping" | "payment" | "processing">("shipping")
  const [paymentError, setPaymentError] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
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

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setPaymentSuccess(true)
    setCurrentStep("processing")

    // Simulate order processing
    setTimeout(() => {
      clearCart()
      router.push(`/checkout/success?payment_intent=${paymentIntentId}`)
    }, 2000)
  }

  const handlePaymentError = (error: string) => {
    setPaymentError(error)
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
                      <div>
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
                        <div>
                          <Label htmlFor="firstName">ຊື່</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">ນາມສະກຸນ</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">ທີ່ຢູ່</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">ເມືອງ</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">ລັດ/ແຂວງ</Label>
                          <Select
                            value={formData.state}
                            onChange={(value) => handleInputChange("state", value.toString())}
                            options={[
                              { value: "CA", label: "California" },
                              { value: "NY", label: "New York" },
                              { value: "TX", label: "Texas" },
                              { value: "FL", label: "Florida" }
                            ]}
                            placeholder="ເລືອກລັດ/ແຂວງ"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="zipCode">ລະຫັດໄປສະນີ</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">ປະເທດ</Label>
                          <Select
                            value={formData.country}
                            onChange={(value) => handleInputChange("country", value.toString())}
                            options={[
                              { value: "US", label: "United States" },
                              { value: "CA", label: "Canada" }
                            ]}
                            placeholder="ເລືອກປະເທດ"
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

                  <PaymentForm amount={finalTotal} onSuccess={handlePaymentSuccess} onError={handlePaymentError} />

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
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ລາຄາ</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ຄ່າສົ່ງ</span>
                      <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ອາກອນ</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>ລວມທັງໝົດ</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {total < 50 && currentStep === "shipping" && (
                    <div className="bg-accent/50 p-3 rounded-lg mt-6">
                      <p className="text-sm text-accent-foreground">
                        Add ${(50 - total).toFixed(2)} more for free shipping!
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
