"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { Package, Truck, CheckCircle, Clock, MapPin, User, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import type { Order } from "@/lib/admin-data"
import { fetchOrdersAPI, type BackendOrder } from "@/lib/api"

interface DisplayOrder {
  id: string
  date: string
  status: string
  total: number
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  fullOrder?: Order // Store full order data for details
}

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<DisplayOrder[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      const resp = await fetchOrdersAPI()
      if (!resp.success || !resp.orders) {
        setOrders([])
        return
      }

      const formatted: DisplayOrder[] = resp.orders.map((o: BackendOrder) => {
        const created = (o.createdAt || o.created_at || new Date().toISOString()) as string
        const items = (o.items || []).map((it) => ({
          name: it.product?.name || `Product #${it.product_id ?? ''}`,
          quantity: it.quantity,
          price: it.product?.price ?? it.price ?? 0,
        }))
        const total = o.total ?? items.reduce((sum, i) => sum + i.price * i.quantity, 0)
        return {
          id: String(o.id).replace("ORD-", "RC"),
          date: created,
          status: o.status || "pending",
          total,
          items,
        }
      })
      setOrders(formatted)
    }
    load()
  }, [])

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
    return new Date(dateString).toLocaleDateString("lo-LA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "processing":
        return "ກຳລັງປະມວນຜົນ"
      case "shipped":
        return "ສົ່ງແລ້ວ"
      case "delivered":
        return "ຈັດສົ່ງສຳເລັດ"
      case "pending":
        return "ລໍຖ້າ"
      default:
        return status
    }
  }

  const handleViewDetails = (order: DisplayOrder) => {
    if (order.fullOrder) {
      setSelectedOrder(order.fullOrder)
      setIsDialogOpen(true)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">ປະຫວັດຄຳສັ່ງຊື້</h1>
            <p className="text-muted-foreground">ຕິດຕາມແລະຈັດການຄຳສັ່ງຊື້ຂອງທ່ານ</p>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">ຍັງບໍ່ມີຄຳສັ່ງຊື້</h3>
                <p className="text-lg text-muted-foreground mb-8">
                  ທ່ານຍັງບໍ່ໄດ້ສັ່ງຊື້ຫຍັງເລີຍ. ເລີ່ມຊື້ເພື່ອເຫັນຄຳສັ່ງຊື້ຂອງທ່ານຢູ່ທີ່ນີ້.
                </p>
                <Link href="/products">
                  <Button size="lg">ຊື້ສິນຄ້າ</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>ຄຳສັ່ງຊື້ #{order.id}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusText(order.status)}</span>
                          </Badge>
                        </CardTitle>
                        <p className="text-muted-foreground">ສັ່ງເມື່ອ {formatDate(order.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{formatPrice(order.total)}</p>
                        <p className="text-sm text-muted-foreground">{order.items.length} ລາຍການ</p>
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
                            <p className="text-sm text-muted-foreground">ຈຳນວນ: {item.quantity}</p>
                          </div>
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="outline" size="sm">
                        <Package className="mr-2 h-4 w-4" />
                        ຕິດຕາມການຈັດສົ່ງ
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(order)}>
                        ເບິ່ງລາຍລະອຽດ
                      </Button>
                      {order.status === "delivered" && (
                        <Button variant="outline" size="sm">
                          ສັ່ງຊື້ອີກ
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

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between mb-2">
                  <DialogTitle>
                    ລາຍລະອຽດຄຳສັ່ງຊື້ #{selectedOrder.id.replace("ORD-", "RC")}
                  </DialogTitle>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1">{getStatusText(selectedOrder.status)}</span>
                  </Badge>
                </div>
                <DialogDescription>
                  ສັ່ງເມື່ອ {formatDate(selectedOrder.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Customer Information */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    ຂໍ້ມູນລູກຄ້າ
                  </h3>
                  <div className="space-y-2 text-sm">
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
                    ທີ່ຢູ່ຈັດສົ່ງ
                  </h3>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{selectedOrder.shippingAddress.street}</p>
                    <p>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                      {selectedOrder.shippingAddress.zipCode}
                    </p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">ລາຍການສິນຄ້າ</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-start p-3 bg-muted rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ຈຳນວນ: {item.quantity} × {formatPrice(item.product.price)}
                          </p>
                        </div>
                        <p className="font-medium ml-4">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Order Summary */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">ສະຫຼຸບຄຳສັ່ງຊື້</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">ລາຄາລວມ:</span>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>ລວມທັງໝົດ:</span>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
