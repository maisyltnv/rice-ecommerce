"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Package, Truck, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"

// Mock order data
const mockOrders = [
  {
    id: "RC123456",
    date: "2025-01-15",
    status: "delivered",
    total: 69.97,
    items: [
      { name: "Himalayan Basmati", quantity: 2, price: 24.99 },
      { name: "Wild Rice Blend", quantity: 1, price: 19.99 },
    ],
  },
  {
    id: "RC123455",
    date: "2025-01-10",
    status: "shipped",
    total: 32.99,
    items: [{ name: "Japanese Short Grain", quantity: 1, price: 32.99 }],
  },
  {
    id: "RC123454",
    date: "2025-01-05",
    status: "processing",
    total: 46.98,
    items: [{ name: "Thai Jasmine Rice", quantity: 2, price: 21.99 }],
  },
]

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">Order History</h1>
            <p className="text-muted-foreground">Track and manage your orders</p>
          </div>

          {mockOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">No Orders Yet</h3>
                <p className="text-lg text-muted-foreground mb-8">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <Link href="/products">
                  <Button size="lg">Shop Rice Collection</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {mockOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>Order #{order.id}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                        </CardTitle>
                        <p className="text-muted-foreground">Placed on {formatDate(order.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{formatPrice(order.total)}</p>
                        <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-border last:border-0"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="outline" size="sm">
                        <Package className="mr-2 h-4 w-4" />
                        Track Package
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {order.status === "delivered" && (
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
