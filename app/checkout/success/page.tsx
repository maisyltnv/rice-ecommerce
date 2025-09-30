"use client"

import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Truck, CreditCard, Download } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const paymentIntentId = searchParams.get("payment_intent")
  const orderNumber = `RC${Date.now().toString().slice(-6)}`

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="font-playfair text-3xl font-bold text-foreground mb-4">Payment Successful!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for your purchase. Your order has been successfully placed and payment has been processed.
          </p>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="text-left space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Order Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Order Number</p>
                      <p className="font-medium">#{orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment ID</p>
                      <p className="font-medium font-mono text-xs">{paymentIntentId || "pi_demo_123456"}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-2">Confirmation sent to your email address</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div className="flex items-start space-x-3">
                    <CreditCard className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-foreground">Payment Confirmed</h4>
                      <p className="text-sm text-muted-foreground">Your payment has been successfully processed</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Package className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium text-foreground">Processing</h4>
                      <p className="text-sm text-muted-foreground">Your order is being prepared for shipment</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Truck className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium text-foreground">Shipping</h4>
                      <p className="text-sm text-muted-foreground">Expected delivery in 3-5 business days</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Button variant="outline" size="lg">
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
            <Link href="/orders">
              <Button variant="outline" size="lg" className="w-full bg-transparent">
                <Package className="mr-2 h-4 w-4" />
                Track Order
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <Link href="/">
              <Button variant="ghost" size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
