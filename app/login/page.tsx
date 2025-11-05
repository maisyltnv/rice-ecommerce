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
import { loginAPI, type LoginRequest } from "@/lib/api"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const credentials: LoginRequest = {
        username: username,
        password: password
      }

      console.log('Login: Attempting login with credentials:', credentials)
      const result = await loginAPI(credentials)
      console.log('Login: Login result:', result)

      if (result.success && result.user && result.token) {
        console.log('Login: Login successful, storing user data:', result.user)

        // Store user data in localStorage
        localStorage.setItem("rice-user", JSON.stringify({
          id: result.user.id,
          email: result.user.email || username + "@example.com",
          name: result.user.username,
          role: result.user.role || 'user',
          token: result.token
        }))

        localStorage.setItem("auth-token", result.token)

        // Reload page to update auth context
        window.location.href = "/"
      } else {
        console.log('Login: Login failed:', result.error)
        setError(result.error || "ການເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດ")
      }
    } catch (err) {
      console.error('Login: Login error:', err)
      setError(`ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ API: ${err instanceof Error ? err.message : 'Unknown error'}`)
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
                  <Label htmlFor="username">ຊື່ຜູ້ໃຊ້ງານ</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ປ້ອນຊື່ຜູ້ໃຊ້ງານ"
                    required
                    autoComplete="username"
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
                <p className="text-sm text-muted-foreground mb-2">🛡️ ຂໍ້ມູນບັນຊີທົດລອງ:</p>
                <div className="text-xs space-y-1">
                  <p>
                    <strong>ຊື່ຜູ້ໃຊ້:</strong> testuser3
                  </p>
                  <p>
                    <strong>ລະຫັດຜ່ານ:</strong> 123456
                  </p>
                </div>
                <div className="mt-4 text-center">
                  <Link
                    href="/admin/login"
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    🛡️ ເຂົ້າສູ່ລະບົບ Admin
                  </Link>
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
