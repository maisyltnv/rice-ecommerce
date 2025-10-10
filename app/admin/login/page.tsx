"use client"

import React, { useState } from "react"
import Link from "next/link"
import { loginAPI, type LoginRequest } from "@/lib/api"

export default function AdminLoginPage() {
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

            const result = await loginAPI(credentials)

            if (result.success && result.user) {
                localStorage.setItem("rice-user", JSON.stringify({
                    id: result.user.id,
                    email: result.user.email,
                    name: result.user.username,
                    role: result.user.role,
                    token: result.token
                }))

                if (result.token) {
                    localStorage.setItem("auth-token", result.token)
                }

                window.location.href = "/admin"
            } else {
                if (username === "testuser" && password === "123456") {
                    localStorage.setItem("rice-user", JSON.stringify({
                        id: 1,
                        email: "admin@heritagerice.com",
                        name: "Admin User",
                        role: "admin",
                        token: "fallback-token"
                    }))
                    window.location.href = "/admin"
                } else {
                    setError(result.error || "ການເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດ")
                }
            }
        } catch (err) {
            setError("ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ API")
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
            fontFamily: 'system-ui, sans-serif'
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
                        backgroundColor: '#3b82f6',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                    }}>
                        🛡️
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
                            backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
                            color: 'white',
                            padding: '12px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {isLoading ? 'ກຳລັງກວດສອບ...' : '🛡️ ເຂົ້າສູ່ລະບົບຜູ້ບໍລິຫານ'}
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
                        fontWeight: '500'
                    }}>
                        🛡️ ຂໍ້ມູນບັນຊີທົດລອງ:
                    </p>
                    <div style={{ fontSize: '12px', color: '#374151' }}>
                        <p><strong>ຊື່ຜູ້ໃຊ້:</strong> testuser</p>
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