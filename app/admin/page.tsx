"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Package, ShoppingCart, Users, Eye, Badge, TrendingUp } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

export default function AdminDashboard() {
  console.log('AdminDashboard: Rendering simple dashboard')

  const formatCurrency = (amount: number) => {
    return formatPrice(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6 pt-20 md:pt-6">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(45231.89)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Active products in catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3</span> new this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "1", customerName: "John Doe", total: 89.99, status: "delivered", createdAt: "2024-01-15" },
                { id: "2", customerName: "Jane Smith", total: 45.50, status: "shipped", createdAt: "2024-01-14" },
                { id: "3", customerName: "Bob Johnson", total: 123.75, status: "processing", createdAt: "2024-01-13" }
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{order.id}</span>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(order.total)}</p>
                    <p className="text-xs text-muted-foreground">1 item</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Products</CardTitle>
            <Link href="/admin/products">
              <Button variant="outline" size="sm">
                <TrendingUp className="mr-2 h-4 w-4" />
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { product: { name: "Premium Jasmine Rice", price: 25.99 }, sales: 156, revenue: 4054.44 },
                { product: { name: "Organic Brown Rice", price: 18.50 }, sales: 89, revenue: 1646.50 },
                { product: { name: "Sticky Rice", price: 22.00 }, sales: 67, revenue: 1474.00 }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Price: {formatCurrency(item.product.price)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.sales} sold</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/products">
              <Button className="w-full bg-transparent" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Manage Products
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button className="w-full bg-transparent" variant="outline">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Process Orders
              </Button>
            </Link>
            <Link href="/admin/customers">
              <Button className="w-full bg-transparent" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View Customers
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
