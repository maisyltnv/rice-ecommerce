"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Skip authentication check for login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  useEffect(() => {
    console.log('Admin layout auth check:', { isLoading, isAuthenticated, user })
    if (!isLoading && (!isAuthenticated || !user)) {
      console.log('Redirecting to login - not authenticated or no user')
      router.push("/admin/login")
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    console.log('Admin layout: Not authenticated or no user, returning null')
    return null
  }

  console.log('Admin layout: User authenticated, rendering admin layout')

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto w-full md:w-auto">{children}</main>
    </div>
  )
}
