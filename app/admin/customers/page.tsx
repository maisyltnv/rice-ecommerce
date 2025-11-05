"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, User, Mail, Phone, MapPin, Calendar, Eye, Edit, Trash2 } from "lucide-react"

// Mock customer data
const mockCustomers = [
    {
        id: "1",
        name: "ສົມຊາຍ ວົງສະຫວັນ",
        email: "somchai@email.com",
        phone: "+856 20 1234 5678",
        address: {
            street: "123 ຖະໜົນລາວ",
            city: "ວຽງຈັນ",
            district: "ຈັນທະບູລີ",
            postalCode: "01000"
        },
        joinDate: "2024-01-15",
        totalOrders: 5,
        totalSpent: 125000,
        status: "active",
        lastOrder: "2024-10-08"
    },
    {
        id: "2",
        name: "ພອງສະຫວັນ ພົມວິຫານ",
        email: "pongsawan@email.com",
        phone: "+856 20 2345 6789",
        address: {
            street: "456 ຖະໜົນເສດຖະກິດ",
            city: "ປາກເຊ",
            district: "ປາກເຊ",
            postalCode: "02000"
        },
        joinDate: "2024-02-20",
        totalOrders: 3,
        totalSpent: 85000,
        status: "active",
        lastOrder: "2024-10-05"
    },
    {
        id: "3",
        name: "ສົມພອນ ສີລາວົງ",
        email: "somporn@email.com",
        phone: "+856 20 3456 7890",
        address: {
            street: "789 ຖະໜົນຫຼວງພະບາງ",
            city: "ຫຼວງພະບາງ",
            district: "ຫຼວງພະບາງ",
            postalCode: "03000"
        },
        joinDate: "2024-03-10",
        totalOrders: 8,
        totalSpent: 195000,
        status: "active",
        lastOrder: "2024-10-09"
    },
    {
        id: "4",
        name: "ມະນີ ວົງສະຫວັນ",
        email: "mani@email.com",
        phone: "+856 20 4567 8901",
        address: {
            street: "321 ຖະໜົນສີສະຫວັນນະຄອນ",
            city: "ສີສະຫວັນນະຄອນ",
            district: "ສີສະຫວັນນະຄອນ",
            postalCode: "04000"
        },
        joinDate: "2024-01-25",
        totalOrders: 2,
        totalSpent: 45000,
        status: "inactive",
        lastOrder: "2024-09-15"
    },
    {
        id: "5",
        name: "ສົມນຶກ ພົມວິຫານ",
        email: "somnuk@email.com",
        phone: "+856 20 5678 9012",
        address: {
            street: "654 ຖະໜົນຊຽງຂວາງ",
            city: "ຊຽງຂວາງ",
            district: "ຊຽງຂວາງ",
            postalCode: "05000"
        },
        joinDate: "2024-04-05",
        totalOrders: 12,
        totalSpent: 285000,
        status: "active",
        lastOrder: "2024-10-10"
    }
]

export default function AdminCustomersPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)

    const filteredCustomers = mockCustomers.filter((customer) => {
        const matchesSearch =
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm)

        const matchesStatus = statusFilter === "all" || customer.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("lo-LA", {
            style: "currency",
            currency: "LAK",
            minimumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("lo-LA", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800"
            case "inactive":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "active":
                return "ໃຊ້ງານຢູ່"
            case "inactive":
                return "ບໍ່ໃຊ້ງານ"
            default:
                return status
        }
    }

    const handleEditCustomer = (customerId: string) => {
        console.log(`Editing customer: ${customerId}`)
        // In a real app, this would open an edit modal or navigate to edit page
    }

    const handleDeleteCustomer = (customerId: string, customerName: string) => {
        if (confirm(`ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບລູກຄ້າ "${customerName}"?`)) {
            console.log(`Deleting customer: ${customerId}`)
            // In a real app, this would make an API call to delete the customer
        }
    }

    return (
        <div className="flex-1 p-4 md:p-6 pt-20 md:pt-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">ຈັດການລູກຄ້າ</h1>
                <p className="text-sm sm:text-base text-muted-foreground">ຈັດການຂໍ້ມູນລູກຄ້າທັງໝົດ</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ລູກຄ້າທັງໝົດ</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockCustomers.length}</div>
                        <p className="text-xs text-muted-foreground">+2 ໃໝ່ເດືອນນີ້</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ລູກຄ້າໃຊ້ງານຢູ່</CardTitle>
                        <User className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {mockCustomers.filter(c => c.status === "active").length}
                        </div>
                        <p className="text-xs text-muted-foreground">ລູກຄ້າໃຊ້ງານ</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ລາຍຮັບລວມ</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0))}
                        </div>
                        <p className="text-xs text-muted-foreground">ຈາກລູກຄ້າທັງໝົດ</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ຄຳສັ່ງຊື້ລວມ</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {mockCustomers.reduce((sum, c) => sum + c.totalOrders, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">ຄຳສັ່ງຊື້ທັງໝົດ</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="ຄົ້ນຫາລູກຄ້າ, ອີເມລ, ເບີໂທ..."
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
                                { value: "all", label: "ທຸກສະຖານະ" },
                                { value: "active", label: "ໃຊ້ງານຢູ່" },
                                { value: "inactive", label: "ບໍ່ໃຊ້ງານ" }
                            ]}
                            placeholder="ຕອງຕາມສະຖານະ"
                            className="w-full sm:w-48"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Customers List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredCustomers.map((customer) => (
                    <Card key={customer.id}>
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="font-semibold text-lg">{customer.name}</h3>
                                        <Badge className={getStatusColor(customer.status)}>
                                            {getStatusLabel(customer.status)}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <Mail className="h-4 w-4" />
                                                <span>{customer.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Phone className="h-4 w-4" />
                                                <span>{customer.phone}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>ເຂົ້າມາ: {formatDate(customer.joinDate)}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p><strong>ຄຳສັ່ງຊື້:</strong> {customer.totalOrders} ລາຍການ</p>
                                            <p><strong>ຍອດເງິນຊື້:</strong> {formatCurrency(customer.totalSpent)}</p>
                                            <p><strong>ຄຳສັ່ງຊື້ລ່າສຸດ:</strong> {formatDate(customer.lastOrder)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedCustomer(selectedCustomer === customer.id ? null : customer.id)}
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        {selectedCustomer === customer.id ? "ຊ່ອງ" : "ເບິ່ງ"} ລາຍລະອຽດ
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditCustomer(customer.id)}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        ແກ້ໄຂ
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        ລຶບ
                                    </Button>
                                </div>
                            </div>

                            {/* Customer Details */}
                            {selectedCustomer === customer.id && (
                                <div className="mt-6 pt-6 border-t border-border">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold mb-3 flex items-center">
                                                <User className="mr-2 h-4 w-4" />
                                                ຂໍ້ມູນສ່ວນຕົວ
                                            </h4>
                                            <div className="text-sm space-y-2">
                                                <p><strong>ຊື່:</strong> {customer.name}</p>
                                                <p><strong>ອີເມລ:</strong> {customer.email}</p>
                                                <p><strong>ເບີໂທ:</strong> {customer.phone}</p>
                                                <p><strong>ວັນທີ່ເຂົ້າມາ:</strong> {formatDate(customer.joinDate)}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-3 flex items-center">
                                                <MapPin className="mr-2 h-4 w-4" />
                                                ທີ່ຢູ່
                                            </h4>
                                            <div className="text-sm space-y-1">
                                                <p>{customer.address.street}</p>
                                                <p>{customer.address.district}, {customer.address.city}</p>
                                                <p>ລະຫັດໄປສະນີ: {customer.address.postalCode}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredCustomers.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">ບໍ່ພົບລູກຄ້າ</h3>
                        <p className="text-muted-foreground">ລອງປ່ຽນເງື່ອນໄຂການຄົ້ນຫາ ຫຼື ການຕອງ.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
