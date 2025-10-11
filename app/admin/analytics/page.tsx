"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    BarChart3,
    PieChart,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react"

// Mock analytics data
const mockAnalytics = {
    revenue: {
        current: 2850000,
        previous: 2450000,
        growth: 16.3
    },
    orders: {
        current: 156,
        previous: 142,
        growth: 9.9
    },
    customers: {
        current: 89,
        previous: 76,
        growth: 17.1
    },
    products: {
        current: 45,
        previous: 42,
        growth: 7.1
    },
    salesByMonth: [
        { month: "ມັງກອນ", revenue: 2200000, orders: 125 },
        { month: "ກຸມພາ", revenue: 1850000, orders: 98 },
        { month: "ມີນາ", revenue: 2100000, orders: 112 },
        { month: "ເມສາ", revenue: 1950000, orders: 105 },
        { month: "ພຶດສະພາ", revenue: 2300000, orders: 128 },
        { month: "ມິຖຸນາ", revenue: 2650000, orders: 145 },
        { month: "ກໍລະກົດ", revenue: 2450000, orders: 135 },
        { month: "ສິງຫາ", revenue: 2750000, orders: 152 },
        { month: "ກັນຍາ", revenue: 2600000, orders: 148 },
        { month: "ຕຸລາ", revenue: 2850000, orders: 156 }
    ],
    topProducts: [
        { name: "ເຂົ້າໜຽວພິເສດ", sales: 89, revenue: 1780000 },
        { name: "ເຂົ້າຍາວອົງການ", sales: 67, revenue: 1340000 },
        { name: "ເຂົ້າຍາວສຸດ", sales: 54, revenue: 1080000 },
        { name: "ເຂົ້າຍາວຫາຍ", sales: 43, revenue: 860000 },
        { name: "ເຂົ້າຍາວຫາມ", sales: 38, revenue: 760000 }
    ],
    salesByCategory: [
        { category: "ເຂົ້າໜຽວ", sales: 45, percentage: 35 },
        { category: "ເຂົ້າຍາວ", sales: 38, percentage: 30 },
        { category: "ເຂົ້າຫາມ", sales: 28, percentage: 22 },
        { category: "ເຂົ້າອື່ນໆ", sales: 17, percentage: 13 }
    ],
    recentActivity: [
        { type: "order", message: "ຄຳສັ່ງຊື້ໃໝ່ #1234 - 285,000 ກີບ", time: "5 ນາທີກ່ອນ", amount: 285000 },
        { type: "customer", message: "ລູກຄ້າໃໝ່ລົງທະບຽນ", time: "12 ນາທີກ່ອນ", amount: 0 },
        { type: "order", message: "ຄຳສັ່ງຊື້ #1233 - 195,000 ກີບ", time: "18 ນາທີກ່ອນ", amount: 195000 },
        { type: "order", message: "ຄຳສັ່ງຊື້ #1232 - 425,000 ກີບ", time: "25 ນາທີກ່ອນ", amount: 425000 },
        { type: "customer", message: "ລູກຄ້າອັບເດດຂໍ້ມູນ", time: "32 ນາທີກ່ອນ", amount: 0 }
    ]
}

export default function AdminAnalyticsPage() {
    const [timeRange, setTimeRange] = useState("30")
    const [selectedMetric, setSelectedMetric] = useState("revenue")

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("lo-LA", {
            style: "currency",
            currency: "LAK",
            minimumFractionDigits: 0
        }).format(amount)
    }

    const getGrowthIcon = (growth: number) => {
        return growth > 0 ? (
            <ArrowUpRight className="h-4 w-4 text-green-600" />
        ) : (
            <ArrowDownRight className="h-4 w-4 text-red-600" />
        )
    }

    const getGrowthColor = (growth: number) => {
        return growth > 0 ? "text-green-600" : "text-red-600"
    }

    const StatCard = ({ title, value, growth, icon: Icon, prefix = "" }: {
        title: string
        value: number | string
        growth: number
        icon: any
        prefix?: string
    }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{prefix}{value}</div>
                <div className={`flex items-center text-xs ${getGrowthColor(growth)}`}>
                    {getGrowthIcon(growth)}
                    <span className="ml-1">{Math.abs(growth)}%</span>
                    <span className="text-muted-foreground ml-1">ຈາກເດືອນກ່ອນ</span>
                </div>
            </CardContent>
        </Card>
    )

    const maxRevenue = Math.max(...mockAnalytics.salesByMonth.map(m => m.revenue))
    const maxOrders = Math.max(...mockAnalytics.salesByMonth.map(m => m.orders))

    return (
        <div className="flex-1 p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">ວິເຄາະຂໍ້ມູນ</h1>
                <p className="text-muted-foreground">ສະຖິຕິ ແລະ ການວິເຄາະຂໍ້ມູນການຂາຍ</p>
            </div>

            {/* Time Range Selector */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">ໄລຍະເວລາ:</span>
                        <Select
                            value={timeRange}
                            onChange={(value) => setTimeRange(value.toString())}
                            options={[
                                { value: "7", label: "7 ວັນຜ່ານມາ" },
                                { value: "30", label: "30 ວັນຜ່ານມາ" },
                                { value: "90", label: "90 ວັນຜ່ານມາ" },
                                { value: "365", label: "1 ປີຜ່ານມາ" }
                            ]}
                            className="w-48"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="ລາຍຮັບລວມ"
                    value={formatCurrency(mockAnalytics.revenue.current)}
                    growth={mockAnalytics.revenue.growth}
                    icon={DollarSign}
                />
                <StatCard
                    title="ຄຳສັ່ງຊື້"
                    value={mockAnalytics.orders.current}
                    growth={mockAnalytics.orders.growth}
                    icon={ShoppingCart}
                />
                <StatCard
                    title="ລູກຄ້າ"
                    value={mockAnalytics.customers.current}
                    growth={mockAnalytics.customers.growth}
                    icon={Users}
                />
                <StatCard
                    title="ສິນຄ້າ"
                    value={mockAnalytics.products.current}
                    growth={mockAnalytics.products.growth}
                    icon={Package}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <TrendingUp className="mr-2 h-5 w-5" />
                            ລາຍຮັບຕາມເດືອນ
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockAnalytics.salesByMonth.slice(-6).map((month, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <div className="w-16 text-sm text-muted-foreground">
                                        {month.month}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <div
                                                className="h-2 bg-primary rounded"
                                                style={{ width: `${(month.revenue / maxRevenue) * 100}%` }}
                                            />
                                            <span className="text-sm font-medium">
                                                {formatCurrency(month.revenue)}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {month.orders} ຄຳສັ່ງຊື້
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <BarChart3 className="mr-2 h-5 w-5" />
                            ສິນຄ້າຂາຍດີ
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockAnalytics.topProducts.map((product, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">{product.sales} ລາຍການ</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-sm">{formatCurrency(product.revenue)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sales by Category */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <PieChart className="mr-2 h-5 w-5" />
                            ການຂາຍຕາມໝວດໝູ່
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockAnalytics.salesByCategory.map((category, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">{category.category}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {category.percentage}% ({category.sales} ລາຍການ)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full"
                                            style={{ width: `${category.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Calendar className="mr-2 h-5 w-5" />
                            ກິດຈະກຳລ່າສຸດ
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockAnalytics.recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${activity.type === 'order' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {activity.type === 'order' ? (
                                            <ShoppingCart className="h-4 w-4" />
                                        ) : (
                                            <Users className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{activity.message}</p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                        {activity.amount > 0 && (
                                            <p className="text-xs text-green-600 font-medium">
                                                +{formatCurrency(activity.amount)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Export Options */}
            <Card>
                <CardHeader>
                    <CardTitle>ສົ່ງອອກລາຍງານ</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <Button variant="outline">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            ສົ່ງອອກ PDF
                        </Button>
                        <Button variant="outline">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            ສົ່ງອອກ Excel
                        </Button>
                        <Button variant="outline">
                            <Calendar className="mr-2 h-4 w-4" />
                            ລາຍງານປະຈຳວັນ
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
