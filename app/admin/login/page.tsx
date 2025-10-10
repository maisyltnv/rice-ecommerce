"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            // Simple validation
            if (email === "admin@heritagerice.com" && password === "password123") {
                // Simulate login success
                localStorage.setItem("admin-user", JSON.stringify({
                    email: "admin@heritagerice.com",
                    name: "Admin User"
                }))
                router.push("/admin")
            } else {
                setError("ອີເມລ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ")
            }
        } catch (err) {
            setError("ເກີດຂໍ້ຜິດພາດ")
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
                {/* Header */}
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

                {/* Form */}
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
                            📧 ອີເມລຜູ້ບໍລິຫານ
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@heritagerice.com"
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

                {/* Demo Credentials */}
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
                        <p><strong>ອີເມລ:</strong> admin@heritagerice.com</p>
                        <p><strong>ລະຫັດ:</strong> password123</p>
                    </div>
                </div>

                {/* Back Link */}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <a
                        href="/"
                        style={{
                            color: '#6b7280',
                            textDecoration: 'none',
                            fontSize: '14px'
                        }}
                    >
                        ← ກັບໄປໜ້າຫຼັກ
                    </a>
                </div>
            </div>
        </div>
    )
}