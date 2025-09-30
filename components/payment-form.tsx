"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  PaymentService,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  formatCardNumber,
  formatExpiryDate,
  getCardBrand,
} from "@/lib/payment"
import { CreditCard, Lock, Loader2, AlertCircle } from "lucide-react"

interface PaymentFormProps {
  amount: number
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

export function PaymentForm({ amount, onSuccess, onError }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "apple_pay">("card")
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value

    if (field === "cardNumber") {
      formattedValue = formatCardNumber(value)
    } else if (field === "expiryDate") {
      formattedValue = formatExpiryDate(value)
    } else if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4)
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nameOnCard.trim()) {
      newErrors.nameOnCard = "Name on card is required"
    }

    if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = "Please enter a valid card number"
    }

    if (!validateExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date"
    }

    if (!validateCVV(formData.cvv)) {
      newErrors.cvv = "Please enter a valid CVV"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    try {
      // Create payment intent
      const paymentIntent = await PaymentService.createPaymentIntent(amount)

      // Confirm payment
      const result = await PaymentService.confirmPayment(paymentIntent.clientSecret, {
        type: "card",
        last4: formData.cardNumber.slice(-4),
        brand: getCardBrand(formData.cardNumber),
      })

      if (result.success && result.paymentIntent) {
        onSuccess(result.paymentIntent.id)
      } else {
        onError(result.error || "Payment failed")
      }
    } catch (error) {
      onError("An unexpected error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  const cardBrand = getCardBrand(formData.cardNumber)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lock className="h-5 w-5" />
          <span>Payment Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Payment Method Selection */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-3 block">Payment Method</Label>
          <div className="grid grid-cols-3 gap-3">
            <Button
              type="button"
              variant={paymentMethod === "card" ? "default" : "outline"}
              size="sm"
              onClick={() => setPaymentMethod("card")}
              className="flex items-center justify-center space-x-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Card</span>
            </Button>
            <Button
              type="button"
              variant={paymentMethod === "paypal" ? "default" : "outline"}
              size="sm"
              onClick={() => setPaymentMethod("paypal")}
              disabled
            >
              PayPal
            </Button>
            <Button
              type="button"
              variant={paymentMethod === "apple_pay" ? "default" : "outline"}
              size="sm"
              onClick={() => setPaymentMethod("apple_pay")}
              disabled
            >
              Apple Pay
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {paymentMethod === "card" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nameOnCard">Name on Card</Label>
              <Input
                id="nameOnCard"
                value={formData.nameOnCard}
                onChange={(e) => handleInputChange("nameOnCard", e.target.value)}
                placeholder="John Doe"
                className={errors.nameOnCard ? "border-destructive" : ""}
              />
              {errors.nameOnCard && (
                <p className="text-sm text-destructive mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.nameOnCard}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={errors.cardNumber ? "border-destructive" : ""}
                />
                {cardBrand !== "unknown" && formData.cardNumber.length > 4 && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs font-medium text-muted-foreground uppercase">{cardBrand}</span>
                  </div>
                )}
              </div>
              {errors.cardNumber && (
                <p className="text-sm text-destructive mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.cardNumber}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={errors.expiryDate ? "border-destructive" : ""}
                />
                {errors.expiryDate && (
                  <p className="text-sm text-destructive mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.expiryDate}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange("cvv", e.target.value)}
                  placeholder="123"
                  maxLength={4}
                  className={errors.cvv ? "border-destructive" : ""}
                />
                {errors.cvv && (
                  <p className="text-sm text-destructive mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.cvv}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Pay ${amount.toFixed(2)}
                </>
              )}
            </Button>

            <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Your payment information is secure and encrypted</span>
            </div>
          </form>
        )}

        {paymentMethod === "paypal" && (
          <div className="text-center py-8">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>PayPal integration coming soon!</AlertDescription>
            </Alert>
          </div>
        )}

        {paymentMethod === "apple_pay" && (
          <div className="text-center py-8">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Apple Pay integration coming soon!</AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
