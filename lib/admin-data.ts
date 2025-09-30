import type { Product } from "./types"

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  items: Array<{
    product: Product
    quantity: number
  }>
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export interface AdminStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalCustomers: number
  recentOrders: Order[]
  topProducts: Array<{
    product: Product
    sales: number
  }>
}

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    items: [
      { product: { id: 1, name: "Himalayan Basmati", price: 24.99 } as Product, quantity: 2 },
      { product: { id: 3, name: "Wild Rice Blend", price: 19.99 } as Product, quantity: 1 },
    ],
    total: 69.97,
    status: "processing",
    createdAt: "2025-01-15T10:30:00Z",
    shippingAddress: {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "US",
    },
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    items: [{ product: { id: 2, name: "Japanese Short Grain", price: 32.99 } as Product, quantity: 1 }],
    total: 32.99,
    status: "shipped",
    createdAt: "2025-01-14T15:45:00Z",
    shippingAddress: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "US",
    },
  },
  {
    id: "ORD-003",
    customerName: "Mike Johnson",
    customerEmail: "mike@example.com",
    items: [
      { product: { id: 1, name: "Himalayan Basmati", price: 24.99 } as Product, quantity: 1 },
      { product: { id: 4, name: "Thai Jasmine Rice", price: 21.99 } as Product, quantity: 2 },
    ],
    total: 68.97,
    status: "delivered",
    createdAt: "2025-01-13T09:15:00Z",
    shippingAddress: {
      street: "789 Pine St",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "US",
    },
  },
  {
    id: "ORD-004",
    customerName: "Sarah Wilson",
    customerEmail: "sarah@example.com",
    items: [{ product: { id: 5, name: "Italian Arborio Rice", price: 28.99 } as Product, quantity: 1 }],
    total: 28.99,
    status: "pending",
    createdAt: "2025-01-15T14:20:00Z",
    shippingAddress: {
      street: "321 Elm St",
      city: "Portland",
      state: "OR",
      zipCode: "97201",
      country: "US",
    },
  },
]

export const getAdminStats = (): AdminStats => {
  const totalOrders = mockOrders.length
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0)
  const totalProducts = 6 // Based on our products data
  const totalCustomers = new Set(mockOrders.map((order) => order.customerEmail)).size

  const recentOrders = mockOrders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Calculate top products by sales
  const productSales = new Map<number, number>()
  mockOrders.forEach((order) => {
    order.items.forEach((item) => {
      const currentSales = productSales.get(item.product.id) || 0
      productSales.set(item.product.id, currentSales + item.quantity)
    })
  })

  const topProducts = Array.from(productSales.entries())
    .map(([productId, sales]) => ({
      product: { id: productId, name: `Product ${productId}` } as Product,
      sales,
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  return {
    totalOrders,
    totalRevenue,
    totalProducts,
    totalCustomers,
    recentOrders,
    topProducts,
  }
}
