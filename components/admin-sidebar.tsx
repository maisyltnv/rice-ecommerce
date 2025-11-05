"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, LogOut, Home, FolderOpen, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border p-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center space-x-2">
          <Image
            src="/riceLogo.png"
            alt="Heritage Rice Logo"
            width={28}
            height={28}
            className="h-7 w-auto object-contain"
          />
          <span className="font-playfair text-lg font-semibold">Admin</span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex h-full flex-col pt-16 md:pt-0">
          {/* Logo - Desktop */}
          <div className="hidden md:flex h-16 items-center border-b border-border px-6">
            <Link href="/admin" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Image
                src="/riceLogo.png"
                alt="Heritage Rice Logo"
                width={32}
                height={32}
                className="h-8 w-auto object-contain"
              />
              <span className="font-playfair text-lg font-semibold">Admin Panel</span>
            </Link>
          </div>

          {/* Logo - Mobile */}
          <div className="md:hidden flex h-16 items-center border-b border-border px-6">
            <Link href="/admin" className="flex items-center space-x-2 hover:opacity-80 transition-opacity" onClick={() => setIsMobileOpen(false)}>
              <Image
                src="/riceLogo.png"
                alt="Heritage Rice Logo"
                width={32}
                height={32}
                className="h-8 w-auto object-contain"
              />
              <span className="font-playfair text-lg font-semibold">Admin Panel</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4 space-y-2">
            <Link href="/" onClick={() => setIsMobileOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Back to Store
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                // Clear all session data
                localStorage.removeItem("rice-user")
                localStorage.removeItem("auth-token")
                sessionStorage.clear()

                // Clear any cookies (if any)
                document.cookie.split(";").forEach((c) => {
                  document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
                })

                // Force redirect to home page
                window.location.href = "/"
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
