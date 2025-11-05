"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { loginAPI, type LoginRequest } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, ArrowLeft, Loader2 } from "lucide-react"

export default function AdminLoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const credentials: LoginRequest = {
                username: username,
                password: password
            }

            console.log('Attempting login with credentials:', credentials)
            const result = await loginAPI(credentials)
            console.log('Login result:', result)

            if (result.success && result.user && result.token) {
                console.log('Login successful, storing user data:', result.user)

                localStorage.setItem("rice-user", JSON.stringify({
                    id: result.user.id,
                    email: result.user.email,
                    name: result.user.username,
                    role: result.user.role || 'admin',
                    token: result.token
                }))

                localStorage.setItem("auth-token", result.token)

                console.log('Redirecting to admin dashboard...')
                // Use router.push for better navigation
                router.push("/admin")
                // Also try window.location as fallback
                setTimeout(() => {
                    window.location.href = "/admin"
                }, 100)
            } else {
                console.log('Login failed:', result.error)
                // Fallback authentication for demo
                if ((username === "testuser2" || username === "testuser3") && password === "123456") {
                    console.log('Using fallback authentication for:', username)
                    localStorage.setItem("rice-user", JSON.stringify({
                        id: 2,
                        email: "newemail@example.com",
                        name: username,
                        role: "admin",
                        token: "demo-token"
                    }))
                    localStorage.setItem("auth-token", "demo-token")

                    console.log('Fallback login successful, redirecting...')
                    router.push("/admin")
                    setTimeout(() => {
                        window.location.href = "/admin"
                    }, 100)
                } else {
                    setError(result.error || "ການເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດ")
                }
            }
        } catch (err) {
            console.error('Login error:', err)
            setError(`ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ API: ${err instanceof Error ? err.message : 'Unknown error'}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: 'var(--font-noto-sans-lao), "Noto Sans Lao", sans-serif'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        margin: '0 auto 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Image
                            src="/riceLogo.png"
                            alt="Rice Logo"
                            width={64}
                            height={64}
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    </div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '8px'
                    }}>
                        ລະບົບຜູ້ບໍລິຫານ
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        ເຂົ້າສູ່ລະບົບຈັດການ Admin Dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            👤 ຊື່ຜູ້ໃຊ້ງານ
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="testuser"
                            required
                            autoComplete="username"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            🔐 ລະຫັດຜ່ານ
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="ປ້ອນລະຫັດຜ່ານ"
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            backgroundColor: isLoading ? '#9ca3af' : '#2d7a3d',
                            color: 'white',
                            padding: '12px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        {isLoading ? (
                            'ກຳລັງກວດສອບ...'
                        ) : (
                            <>
                                <Image
                                    src="/riceLogo.png"
                                    alt=""
                                    width={20}
                                    height={20}
                                    style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                                />
                                ເຂົ້າສູ່ລະບົບຜູ້ບໍລິຫານ
                            </>
                        )}
                    </button>
                </form>

                <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                }}>
                    <p style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        marginBottom: '8px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <Image
                            src="/riceLogo.png"
                            alt=""
                            width={16}
                            height={16}
                            style={{ objectFit: 'contain' }}
                        />
                        ຂໍ້ມູນບັນຊີທົດລອງ:
                    </p>
                    <div style={{ fontSize: '12px', color: '#374151' }}>
                        <p><strong>ຊື່ຜູ້ໃຊ້:</strong> testuser3 (ຫຼື testuser2)</p>
                        <p><strong>ລະຫັດ:</strong> 123456</p>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link
                        href="/"
                        style={{
                            color: '#6b7280',
                            textDecoration: 'none',
                            fontSize: '14px'
                        }}
                    >
                        ← ກັບໄປໜ້າຫຼັກ
                    </Link>
                </div>
            </div>
        </div>
    )
}