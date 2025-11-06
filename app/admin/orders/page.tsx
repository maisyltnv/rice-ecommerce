"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { mockOrders } from "@/lib/admin-data"
import { Search, Eye, Package, Truck } from "lucide-react"

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return formatPrice(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
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

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // In a real app, this would make an API call
    console.log(`Updating order ${orderId} to status: ${newStatus}`)
  }

  return (
    <div className="p-4 md:p-6 space-y-6 pt-20 md:pt-6">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders, customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value.toString())}
              options={[
                { value: "all", label: "All Orders" },
                { value: "pending", label: "Pending" },
                { value: "processing", label: "Processing" },
                { value: "shipped", label: "Shipped" },
                { value: "delivered", label: "Delivered" },
                { value: "cancelled", label: "Cancelled" }
              ]}
              placeholder="Filter by status"
              className="w-full sm:w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg">{order.id}</h3>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p>
                        <strong>Customer:</strong> {order.customerName}
                      </p>
                      <p>
                        <strong>Email:</strong> {order.customerEmail}
                      </p>
                      <p>
                        <strong>Date:</strong> {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Items:</strong> {order.items.length}
                      </p>
                      <p>
                        <strong>Total:</strong> {formatCurrency(order.total)}
                      </p>
                      <p>
                        <strong>Address:</strong> {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {selectedOrder === order.id ? "Hide" : "View"} Details
                  </Button>
                  {order.status === "pending" && (
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, "processing")}>
                      <Package className="mr-2 h-4 w-4" />
                      Process
                    </Button>
                  )}
                  {order.status === "processing" && (
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, "shipped")}>
                      <Truck className="mr-2 h-4 w-4" />
                      Ship
                    </Button>
                  )}
                </div>
              </div>

              {/* Order Details */}
              {selectedOrder === order.id && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium">{formatCurrency(item.product.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Shipping Address</h4>
                      <div className="text-sm space-y-1">
                        <p>{order.customerName}</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No orders found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
