import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display } from "next/font/google"
import { Noto_Sans_Lao, Noto_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/lib/auth-context"
import { ToastProvider } from "@/components/ui/toast"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const notoLao = Noto_Sans_Lao({
  subsets: ["lao", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-lao",
  display: "swap",
})

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Heritage Rice Co. - Premium Quality Rice",
  description:
    "Discover our premium collection of heritage rice varieties, sourced from the finest farms and delivered fresh to your table.",
  generator: "v0.app",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfair.variable} ${notoSans.variable} ${notoLao.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Suspense fallback={<div>Loading...</div>}>
                {children}
                <Analytics />
              </Suspense>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
