"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { Eye, EyeOff, Loader2, Shield, Lock, Mail } from "lucide-react"

export default function AdminLoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const { login, user, isAuthenticated } = useAuth()
    const router = useRouter()

    // Redirect if already logged in as admin
    useEffect(() => {
        if (isAuthenticated && user?.email === "admin@heritagerice.com") {
            router.push("/admin")
        }
    }, [isAuthenticated, user, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            // Validate admin email format
            if (!email.includes("admin")) {
                setError("ກະລຸນາໃຊ້ບັນຊີຜູ້ບໍລິຫານເທົ່ານັ້ນ")
                setIsLoading(false)
                return
            }

            const result = await login(email, password)

            if (result.success) {
                // Check if user is admin
                if (email === "admin@heritagerice.com") {
                    router.push("/admin")
                } else {
                    setError("ທ່ານບໍ່ມີສິດເຂົ້າເຖິງລະບົບຜູ້ບໍລິຫານ")
                    // Logout non-admin user
                    setTimeout(() => {
                        router.push("/login")
                    }, 2000)
                }
            } else {
                setError(result.error || "ເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດ")
            }
        } catch (err) {
            setError("ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຄາດຄິດ")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            {/* Admin Logo */}
            <div className="absolute top-8 left-8">
                <Link href="/" className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-primary"></div>
                    <span className="font-playfair text-xl font-semibold">ເຂົ້າດີ</span>
                </Link>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md">
                <Card className="shadow-xl">
                    <CardHeader className="text-center space-y-4 pb-6">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="font-playfair text-3xl">
                                ລະບົບຜູ້ບໍລິຫານ
                            </CardTitle>
                            <CardDescription className="mt-2">
                                ເຂົ້າສູ່ລະບົບຈັດການ Admin Dashboard
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    ອີເມລຼູ້ບໍລິຫານ
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@heritagerice.com"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    ລະຫັດຜ່ານ
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="ປ້ອນລະຫັດຜ່ານ"
                                        className="pr-10"
                                        required
                                        autoComplete="current-password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 text-base font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        ກຳລັງກວດສອບ...
                                    </>
                                ) : (
                                    <>
                                        <Shield className="mr-2 h-5 w-5" />
                                        ເຂົ້າສູ່ລະບົບຜູ້ບໍລິຫານ
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Demo Credentials */}
                        <div className="mt-6 p-4 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                                <Shield className="w-3 h-3" />
                                ຂໍ້ມູນບັນຊີທົດລອງ:
                            </p>
                            <div className="text-xs space-y-1">
                                <p className="text-foreground">
                                    <span className="text-primary font-semibold">ອີເມລ:</span> admin@heritagerice.com
                                </p>
                                <p className="text-foreground">
                                    <span className="text-primary font-semibold">ລະຫັດ:</span> password123
                                </p>
                            </div>
                        </div>

                        {/* Back to Site */}
                        <div className="mt-6 text-center">
                            <Link
                                href="/"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                ← ກັບໄປໜ້າຫຼັກ
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-400">
                        🔒 ການເຂົ້າສູ່ລະບົບນີ້ຖືກເຂົ້າລະຫັດ ແລະ ປອດໄພ
                    </p>
                </div>
            </div>
        </div>
    )
}

