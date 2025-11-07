"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle, ArrowLeft, User, Mail, MapPin } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { fetchOrdersAPI, type BackendOrder } from "@/lib/api"

interface DisplayItem { name: string; quantity: number; price: number }

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<{
    id: string
    date: string
    status: string
    total: number
    items: DisplayItem[]
  } | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      const resp = await fetchOrdersAPI()
      if (!resp.success || !resp.orders) {
        setError(resp.error || "Failed to load order")
        setLoading(false)
        return
      }
      const match = resp.orders.find((o: BackendOrder) => String(o.id) === String(params.id))
      if (!match) {
        setError("Order not found")
        setLoading(false)
        return
      }
      const rawItems = (match as any).items || (match as any).order_items || []
      const items: DisplayItem[] = rawItems.map((it: any) => ({
        name: it.product?.name || it.product_name || `Product #${it.product_id ?? ''}`,
        quantity: it.quantity ?? it.qty ?? 0,
        price: it.product?.price ?? it.price ?? it.unit_price ?? 0,
      }))
      const orderTotal = (match as any).total ?? (match as any).total_price ?? (match as any).amount ?? (match as any).grand_total ?? (match as any).totalAmount
      const computed = items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0)
      const total = Number(orderTotal ?? computed) || 0
      const date = (match.createdAt || match.created_at || new Date().toISOString()) as string
      setOrder({ id: String(match.id), date, status: match.status || "pending", total, items })
      setLoading(false)
    }
    load()
  }, [params.id])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Button variant="ghost" className="mb-4" onClick={() => router.push('/orders')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> ກັບໄປປະຫວັດຄຳສັ່ງຊື້
          </Button>

          {loading ? (
            <div className="text-center py-24">Loading...</div>
          ) : error ? (
            <div className="text-center py-24 text-red-500">{error}</div>
          ) : order ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>ລາຍລະອຽດຄຳສັ່ງຊື້ #{order.id}</span>
                  <span className="inline-flex items-center text-sm text-muted-foreground">
                    {getStatusIcon(order.status)}
                    <span className="ml-2 capitalize">{order.status}</span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="text-sm text-muted-foreground">ສັ່ງເມື່ອ {new Date(order.date).toLocaleString()}</div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-1">ລາຍການສິນຄ້າ</h3>
                  <div className="space-y-0.5">
                    {order.items.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No items on this order.</p>
                    ) : (
                      order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1 border-b last:border-0">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">ຈຳນວນ: {item.quantity}</p>
                          </div>
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>ລວມທັງໝົດ:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  )
}


