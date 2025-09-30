"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        router.push("/")
      } else {
        setError(result.error || "Login failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-playfair text-2xl">ຍິນດີຕ້ອນຮັບກັບຄືນ</CardTitle>
              <p className="text-muted-foreground">ເຂົ້າສູ່ບັນຊີ Heritage Rice Co. ຂອງທ່ານ</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">ອີເມວ</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ປ້ອນອີເມວຂອງທ່ານ"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">ລະຫັດຜ່ານ</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="ປ້ອນລະຫັດຜ່ານ"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ກຳລັງເຂົ້າສູ່...
                    </>
                  ) : (
                    "ເຂົ້າສູ່ລະບົບ"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  ບໍ່ມີບັນຊີ?{" "}
                  <Link href="/signup" className="text-primary hover:underline">
                    ລົງທະບຽນ
                  </Link>
                </p>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  ລືມລະຫັດຜ່ານ?
                </Link>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">ບັນຊີທົດລອງ:</p>
                <div className="text-xs space-y-1">
                  <p>
                    <strong>Admin:</strong> admin@heritagerice.com / password123
                  </p>
                  <p>
                    <strong>User:</strong> user@example.com / password123
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
