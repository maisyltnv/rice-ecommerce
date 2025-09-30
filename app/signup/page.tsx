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

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    try {
      const result = await signup(email, password, name)
      if (result.success) {
        router.push("/")
      } else {
        setError(result.error || "Signup failed")
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
              <CardTitle className="font-playfair text-2xl">ສ້າງບັນຊີ</CardTitle>
              <p className="text-muted-foreground">ເຂົ້າຮ່ວມ Heritage Rice Co. ແລະເລີ່ມຊື້ຂ້າວຊັ້ນດີ</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">ຊື່ເຕັມ</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ປ້ອນຊື່ເຕັມຂອງທ່ານ"
                    required
                  />
                </div>

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
                      placeholder="ສ້າງລະຫັດຜ່ານ"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">ຢືນຢັນລະຫັດຜ່ານ</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="ຢືນຢັນລະຫັດຜ່ານຂອງທ່ານ"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ກຳລັງສ້າງບັນຊີ...
                    </>
                  ) : (
                    "ສ້າງບັນຊີ"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  ມີບັນຊີແລ້ວບໍ?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    ເຂົ້າສູ່ລະບົບ
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
