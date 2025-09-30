// Mock payment processing service
export interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "apple_pay" | "google_pay"
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: "requires_payment_method" | "requires_confirmation" | "processing" | "succeeded" | "failed"
  clientSecret: string
}

export interface PaymentResult {
  success: boolean
  paymentIntent?: PaymentIntent
  error?: string
}

// Mock Stripe-like payment service
export class PaymentService {
  static async createPaymentIntent(amount: number, currency = "usd"): Promise<PaymentIntent> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      id: `pi_${Date.now()}`,
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      status: "requires_payment_method",
      clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
    }
  }

  static async confirmPayment(clientSecret: string, paymentMethod: Partial<PaymentMethod>): Promise<PaymentResult> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock payment validation
    if (!paymentMethod.type || !clientSecret) {
      return {
        success: false,
        error: "Invalid payment method or client secret",
      }
    }

    // Simulate random payment failures for demo
    if (Math.random() < 0.1) {
      return {
        success: false,
        error: "Your card was declined. Please try a different payment method.",
      }
    }

    const paymentIntent: PaymentIntent = {
      id: clientSecret.split("_secret_")[0],
      amount: 0, // Would be retrieved from server
      currency: "usd",
      status: "succeeded",
      clientSecret,
    }

    return {
      success: true,
      paymentIntent,
    }
  }

  static async retrievePaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    // Mock saved payment methods
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      {
        id: "pm_1",
        type: "card",
        last4: "4242",
        brand: "visa",
        expiryMonth: 12,
        expiryYear: 2025,
      },
      {
        id: "pm_2",
        type: "card",
        last4: "0005",
        brand: "mastercard",
        expiryMonth: 8,
        expiryYear: 2026,
      },
    ]
  }
}

// Card validation utilities
export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, "")
  return /^\d{13,19}$/.test(cleaned) && luhnCheck(cleaned)
}

export const validateExpiryDate = (expiryDate: string): boolean => {
  const [month, year] = expiryDate.split("/")
  if (!month || !year) return false

  const monthNum = Number.parseInt(month, 10)
  const yearNum = Number.parseInt(`20${year}`, 10)
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  return (
    monthNum >= 1 && monthNum <= 12 && yearNum >= currentYear && (yearNum > currentYear || monthNum >= currentMonth)
  )
}

export const validateCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv)
}

// Luhn algorithm for card number validation
function luhnCheck(cardNumber: string): boolean {
  let sum = 0
  let isEven = false

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(cardNumber.charAt(i), 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

// Format card number with spaces
export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\s/g, "")
  const match = cleaned.match(/\d{1,4}/g)
  return match ? match.join(" ") : ""
}

// Format expiry date
export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, "")
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
  }
  return cleaned
}

// Get card brand from number
export const getCardBrand = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, "")

  if (/^4/.test(cleaned)) return "visa"
  if (/^5[1-5]/.test(cleaned)) return "mastercard"
  if (/^3[47]/.test(cleaned)) return "amex"
  if (/^6/.test(cleaned)) return "discover"

  return "unknown"
}
