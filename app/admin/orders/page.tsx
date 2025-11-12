"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { Order } from "@/lib/admin-data"
import type { Product } from "@/lib/types"
import { fetchOrdersAPI, updateOrderStatusAPI, fetchOrderByIdAPI, type BackendOrder } from "@/lib/api"
import { Search, Eye, Package, Truck, User, Mail, MapPin, Calendar, Loader2 } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "/noimage.png"
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }
  if (imagePath.startsWith("/uploads")) {
    return `${API_BASE_URL}${imagePath}`
  }
  if (imagePath.startsWith("/")) {
    return imagePath
  }
  return `/${imagePath}`
}

interface RawAddressObject {
  street?: string
  address_line1?: string
  address?: string
  line1?: string
  city?: string
  town?: string
  district?: string
  state?: string
  province?: string
  region?: string
  zipCode?: string
  zip_code?: string
  postal_code?: string
  country?: string
  country_code?: string
}

const EMPTY_ADDRESS = {
  street: "N/A",
  city: "N/A",
  state: "N/A",
  zipCode: "N/A",
  country: "N/A",
}

const parseStringAddress = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    return { ...EMPTY_ADDRESS }
  }

  // Attempt to parse JSON strings first
  try {
    const parsed = JSON.parse(trimmed)
    if (parsed && typeof parsed === "object") {
      return normalizeObjectAddress(parsed as RawAddressObject)
    }
  } catch {
    // Not JSON, treat as plain text
  }

  return {
    ...EMPTY_ADDRESS,
    street: trimmed,
  }
}

const normalizeObjectAddress = (address: RawAddressObject | null | undefined) => {
  if (!address) {
    return { ...EMPTY_ADDRESS }
  }

  return {
    street: address.street || address.address_line1 || address.address || address.line1 || "N/A",
    city: address.city || address.town || address.district || "N/A",
    state: address.state || address.province || address.region || "N/A",
    zipCode: address.zipCode || address.zip_code || address.postal_code || "N/A",
    country: address.country || address.country_code || "N/A",
  }
}

const mergeAddress = (primary: typeof EMPTY_ADDRESS, fallback: typeof EMPTY_ADDRESS) => {
  return {
    street: primary.street !== "N/A" ? primary.street : fallback.street,
    city: primary.city !== "N/A" ? primary.city : fallback.city,
    state: primary.state !== "N/A" ? primary.state : fallback.state,
    zipCode: primary.zipCode !== "N/A" ? primary.zipCode : fallback.zipCode,
    country: primary.country !== "N/A" ? primary.country : fallback.country,
  }
}

const normalizeShippingAddress = (rawAddress: unknown, customerData?: any) => {
  let normalized = { ...EMPTY_ADDRESS }

  if (typeof rawAddress === "string") {
    normalized = parseStringAddress(rawAddress)
  } else if (rawAddress && typeof rawAddress === "object") {
    normalized = normalizeObjectAddress(rawAddress as RawAddressObject)
  }

  if (
    customerData?.address &&
    (normalized.street === "N/A" || normalized.city === "N/A" || normalized.state === "N/A")
  ) {
    const customerAddress = parseStringAddress(String(customerData.address))
    normalized = mergeAddress(normalized, customerAddress)
  }

  return normalized
}

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const resp = await fetchOrdersAPI()
        if (!resp.success) {
          setError(resp.error || "Failed to load orders")
          setOrders([])
          setLoading(false)
          return
        }

        // Handle different response formats
        let ordersData = resp.orders
        if (!ordersData && (resp as any).data) {
          // If orders is not directly available, check data property
          ordersData = Array.isArray((resp as any).data)
            ? (resp as any).data
            : (resp as any).data?.orders
        }

        if (!ordersData || !Array.isArray(ordersData)) {
          setError("Invalid orders data format")
          setOrders([])
          setLoading(false)
          return
        }

        // Transform backend orders to admin Order format
        const transformedOrders: Order[] = ordersData
          .map((o: BackendOrder) => transformBackendOrder(o))
          .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime()
            const dateB = new Date(b.createdAt).getTime()
            return dateB - dateA
          })

        setOrders(transformedOrders)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders")
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  const filteredOrders = orders.filter((order) => {
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

  const transformBackendOrder = (o: BackendOrder): Order => {
    const created = (o.createdAt || o.created_at || new Date().toISOString()) as string

    const rawItems = (o as any).items ||
      (o as any).order_items ||
      (o as any).orderItems ||
      []

    const customerData = (o as any).customer || {}

    const customerName = customerData.name ||
      customerData.full_name ||
      (o as any).customer_name ||
      (o as any).customerName ||
      customerData.username ||
      "Customer"

    const customerEmail = customerData.email ||
      (o as any).customer_email ||
      (o as any).customerEmail ||
      customerData.email_address ||
      "customer@example.com"

    const shippingAddressRaw = (o as any).shipping_address ||
      (o as any).shippingAddress ||
      (o as any).shipping ||
      (o as any).address

    const shippingAddress = normalizeShippingAddress(shippingAddressRaw, customerData)

    const items = rawItems.map((it: any) => {
      const productId = it.product?.id || it.product_id || 0
      const productName = it.product?.name ||
        it.product_name ||
        it.name ||
        `Product #${productId}`
      const productPrice = it.product?.price ??
        it.price ??
        it.unit_price ??
        it.product?.unit_price ??
        0
      const productImageRaw = it.product?.image ||
        it.product_image ||
        it.image ||
        it.product?.image_url

      const productImage = getImageUrl(productImageRaw)

      const product: Product = {
        id: productId,
        name: productName,
        description: it.product?.description || it.description || "",
        price: Number(productPrice) || 0,
        image: productImage,
        images: it.product?.images || it.images || [productImage].filter(Boolean),
        category: it.product?.category || it.category || "",
        inStock: it.product?.inStock ?? it.in_stock ?? true,
        weight: it.product?.weight || it.weight || "",
        origin: it.product?.origin || it.origin || "",
        grainType: (it.product?.grainType || it.grain_type || "medium") as "long" | "medium" | "short",
        cookingTime: it.product?.cookingTime || it.cooking_time || 0,
        nutritionFacts: it.product?.nutritionFacts || it.nutrition_facts || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fiber: 0,
        },
        features: it.product?.features || it.features || [],
      }

      return {
        product,
        quantity: Number(it.quantity ?? it.qty ?? 0) || 0,
      }
    }).filter((item: { product: Product; quantity: number }) => item.quantity > 0)

    const orderTotal = (o as any).total ??
      (o as any).total_price ??
      (o as any).amount ??
      (o as any).grand_total ??
      (o as any).totalAmount
    const computed = items.reduce((sum: number, i: any) =>
      sum + (Number(i.product.price) || 0) * (Number(i.quantity) || 0), 0)
    const total = Number(orderTotal ?? computed) || 0

    return {
      id: String(o.id).startsWith("ORD-") ? String(o.id) : `ORD-${o.id}`,
      customerName,
      customerEmail,
      items,
      total,
      status: (o.status || "pending") as Order["status"],
      createdAt: created,
      shippingAddress,
    }
  }

  const handleViewDetails = async (order: Order) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
    setIsDetailLoading(true)
    try {
      const orderIdNum = order.id.replace("ORD-", "")
      const response = await fetchOrderByIdAPI(orderIdNum)
      if (response.success && response.order) {
        const transformed = transformBackendOrder(response.order as BackendOrder)
        setSelectedOrder(transformed)
      } else if (response.error) {
        console.error("Failed to load order details:", response.error)
      }
    } catch (err) {
      console.error("Error loading order details:", err)
    } finally {
      setIsDetailLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Remove "ORD-" prefix if present for API call
      const orderIdNum = orderId.replace("ORD-", "")
      const resp = await updateOrderStatusAPI(orderIdNum, newStatus)

      if (resp.success) {
        // Update the order in local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId
              ? { ...order, status: newStatus as Order["status"] }
              : order
          )
        )
      } else {
        console.error("Failed to update order status:", resp.error)
        alert(`Failed to update order status: ${resp.error}`)
      }
    } catch (err) {
      console.error("Error updating order status:", err)
      alert(`Error updating order status: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
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

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading orders...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2 text-red-500">Error loading orders</h3>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      {!loading && !error && (
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
                      onClick={() => handleViewDetails(order)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && filteredOrders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No orders found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl">Order Details - {selectedOrder.id}</DialogTitle>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <DialogDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Ordered on {formatDate(selectedOrder.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 relative">
                {isDetailLoading && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 rounded-lg border border-border/40 z-10">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading latest order details...</p>
                  </div>
                )}
                {/* Customer Information */}
                <div>
                  <h3 className="font-semibold text-foreground mb-1 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm bg-muted p-2 rounded-lg">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{selectedOrder.customerEmail}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Shipping Address */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Shipping Address
                  </h3>
                  <div className="text-sm space-y-1 bg-muted p-4 rounded-lg">
                    {selectedOrder.shippingAddress.street !== "N/A" ? (
                      <>
                        <p className="font-medium">{selectedOrder.customerName}</p>
                        <p>{selectedOrder.shippingAddress.street}</p>
                        <p>
                          {selectedOrder.shippingAddress.city !== "N/A" && selectedOrder.shippingAddress.city}
                          {selectedOrder.shippingAddress.city !== "N/A" && selectedOrder.shippingAddress.state !== "N/A" && ", "}
                          {selectedOrder.shippingAddress.state !== "N/A" && selectedOrder.shippingAddress.state}
                          {selectedOrder.shippingAddress.zipCode !== "N/A" && ` ${selectedOrder.shippingAddress.zipCode}`}
                        </p>
                        {selectedOrder.shippingAddress.country !== "N/A" && (
                          <p>{selectedOrder.shippingAddress.country}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-muted-foreground italic">Shipping address not provided</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Order Items ({selectedOrder.items.length})</h3>
                  {selectedOrder.items.length === 0 ? (
                    <div className="bg-muted p-6 rounded-lg text-center border border-border">
                      <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No items found in this order</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-start p-4 bg-muted rounded-lg border border-border"
                        >
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              {item.product.image && (
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-16 h-16 object-cover rounded border border-border"
                                  onError={(e) => {
                                    const target = e.currentTarget
                                    if (!target.dataset.fallback) {
                                      target.dataset.fallback = "true"
                                      target.src = "/noimage.png"
                                    }
                                  }}
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-base">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Product ID: {item.product.id}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {item.quantity} × {formatCurrency(item.product.price)} = {formatCurrency(item.product.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="font-semibold text-base ml-4">
                            {formatCurrency(item.product.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Order Summary */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
                  <div className="space-y-2 bg-muted p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Items: {selectedOrder.items.length} {selectedOrder.items.length === 1 ? 'item' : 'items'}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(selectedOrder.items.reduce((sum, item) =>
                          sum + (item.product.price * item.quantity), 0
                        ))}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount:</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                    {selectedOrder.items.length > 0 && selectedOrder.total === 0 && (
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Note: Total is calculated as 0. Please verify order items.
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  {selectedOrder.status === "pending" && (
                    <Button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, "processing")
                        setIsDialogOpen(false)
                      }}
                      className="flex-1"
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Mark as Processing
                    </Button>
                  )}
                  {selectedOrder.status === "processing" && (
                    <Button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, "shipped")
                        setIsDialogOpen(false)
                      }}
                      className="flex-1"
                    >
                      <Truck className="mr-2 h-4 w-4" />
                      Mark as Shipped
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
