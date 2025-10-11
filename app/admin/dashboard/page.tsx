"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import Link from "next/link"

export default function SimpleDashboard() {
    console.log('SimpleDashboard: Rendering simple dashboard')

    return (
        <div className="flex-1 p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">ຍິນດີຕ້ອນຮັບສູ່ລະບົບຜູ້ບໍລິຫານ</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ລາຍຮັບລວມ</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">+20.1% ຈາກເດືອນກ່ອນ</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ລູກຄ້າ</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">+180.1% ຈາກເດືອນກ່ອນ</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ສິນຄ້າ</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,234</div>
                        <p className="text-xs text-muted-foreground">+19% ຈາກເດືອນກ່ອນ</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ຄຳສັ່ງຊື້</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">+201 ຈາກເດືອນກ່ອນ</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>ຈັດການສິນຄ້າ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            ເພີ່ມ, ແກ້ໄຂ, ຫຼືລຶບສິນຄ້າໃນລະບົບ
                        </p>
                        <Button asChild>
                            <Link href="/admin/products">ເຂົ້າສູ່ຈັດການສິນຄ້າ</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>ຈັດການໝວດໝູ່</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            ຈັດການໝວດໝູ່ສິນຄ້າ
                        </p>
                        <Button asChild>
                            <Link href="/admin/categories">ເຂົ້າສູ່ຈັດການໝວດໝູ່</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>ລາຍງານ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            ເບິ່ງລາຍງານການຂາຍແລະສະຖິຕິ
                        </p>
                        <Button variant="outline">
                            ເບິ່ງລາຍງານ
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
