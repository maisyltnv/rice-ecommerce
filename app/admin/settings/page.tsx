"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
    Settings,
    User,
    Shield,
    Bell,
    Globe,
    Mail,
    Database,
    Save,
    RefreshCw,
    Eye,
    EyeOff,
    Upload
} from "lucide-react"

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("general")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Form states
    const [generalSettings, setGeneralSettings] = useState({
        siteName: "Heritage Rice Shop",
        siteDescription: "ຮ້ານຂາຍເຂົ້າພື້ນເມືອງລາວ",
        siteUrl: "https://heritagerice.com",
        adminEmail: "admin@heritagerice.com",
        currency: "LAK",
        timezone: "Asia/Vientiane",
        language: "lo"
    })

    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordMinLength: 8,
        loginAttempts: 5,
        ipWhitelist: "",
        sslEnabled: true
    })

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        orderNotifications: true,
        customerNotifications: true,
        systemNotifications: true,
        lowStockAlerts: true,
        weeklyReports: true
    })

    const [systemSettings, setSystemSettings] = useState({
        maintenanceMode: false,
        debugMode: false,
        autoBackup: true,
        backupFrequency: "daily",
        maxFileSize: 10,
        allowedFileTypes: "jpg,jpeg,png,pdf"
    })

    const handleSaveSettings = async (section: string) => {
        setIsLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        console.log(`Saving ${section} settings:`, {
            general: generalSettings,
            security: securitySettings,
            notifications: notificationSettings,
            system: systemSettings
        })

        setIsLoading(false)
        alert(`${section} settings ບັນທຶກສຳເລັດ!`)
    }

    const handleResetSettings = () => {
        if (confirm("ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຣີເຊັດກັບຄືນສະຖານະເດີມ?")) {
            setGeneralSettings({
                siteName: "Heritage Rice Shop",
                siteDescription: "ຮ້ານຂາຍເຂົ້າພື້ນເມືອງລາວ",
                siteUrl: "https://heritagerice.com",
                adminEmail: "admin@heritagerice.com",
                currency: "LAK",
                timezone: "Asia/Vientiane",
                language: "lo"
            })
            alert("ຣີເຊັດກັບຄືນສະຖານະເດີມສຳເລັດ!")
        }
    }

    const tabs = [
        { id: "general", label: "ທົ່ວໄປ", icon: Settings },
        { id: "security", label: "ຄວາມປອດໄພ", icon: Shield },
        { id: "notifications", label: "ການແຈ້ງເຕືອນ", icon: Bell },
        { id: "system", label: "ລະບົບ", icon: Database }
    ]

    return (
        <div className="flex-1 p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">ຕັ້ງຄ່າລະບົບ</h1>
                <p className="text-muted-foreground">ຈັດການການຕັ້ງຄ່າລະບົບທັງໝົດ</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-4">
                            <nav className="space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-muted"
                                                }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            <span>{tab.label}</span>
                                        </button>
                                    )
                                })}
                            </nav>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {/* General Settings */}
                    {activeTab === "general" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Settings className="mr-2 h-5 w-5" />
                                    ການຕັ້ງຄ່າທົ່ວໄປ
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="siteName">ຊື່ເວັບໄຊທ໌</Label>
                                        <Input
                                            id="siteName"
                                            value={generalSettings.siteName}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                                            placeholder="ປ້ອນຊື່ເວັບໄຊທ໌"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="siteUrl">URL ເວັບໄຊທ໌</Label>
                                        <Input
                                            id="siteUrl"
                                            value={generalSettings.siteUrl}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, siteUrl: e.target.value })}
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="siteDescription">ຄຳອະທິບາຍ</Label>
                                    <Textarea
                                        id="siteDescription"
                                        value={generalSettings.siteDescription}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                                        placeholder="ປ້ອນຄຳອະທິບາຍເວັບໄຊທ໌"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="adminEmail">ອີເມລຜູ້ບໍລິຫານ</Label>
                                        <Input
                                            id="adminEmail"
                                            type="email"
                                            value={generalSettings.adminEmail}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, adminEmail: e.target.value })}
                                            placeholder="admin@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currency">ສະກຸນເງິນ</Label>
                                        <Select
                                            value={generalSettings.currency}
                                            onChange={(value) => setGeneralSettings({ ...generalSettings, currency: value.toString() })}
                                            options={[
                                                { value: "LAK", label: "ກີບ (LAK)" },
                                                { value: "USD", label: "ໂດລາ (USD)" },
                                                { value: "THB", label: "ບາດ (THB)" }
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="timezone">ເຂດເວລາ</Label>
                                        <Select
                                            value={generalSettings.timezone}
                                            onChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value.toString() })}
                                            options={[
                                                { value: "Asia/Vientiane", label: "ວຽງຈັນ (UTC+7)" },
                                                { value: "Asia/Bangkok", label: "ບາງກອກ (UTC+7)" },
                                                { value: "UTC", label: "UTC (UTC+0)" }
                                            ]}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="language">ພາສາ</Label>
                                        <Select
                                            value={generalSettings.language}
                                            onChange={(value) => setGeneralSettings({ ...generalSettings, language: value.toString() })}
                                            options={[
                                                { value: "lo", label: "ພາສາລາວ" },
                                                { value: "en", label: "English" },
                                                { value: "th", label: "ไทย" }
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <Button
                                        onClick={() => handleSaveSettings("general")}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="mr-2 h-4 w-4" />
                                        )}
                                        ບັນທຶກ
                                    </Button>
                                    <Button variant="outline" onClick={handleResetSettings}>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        ຣີເຊັດ
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Security Settings */}
                    {activeTab === "security" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Shield className="mr-2 h-5 w-5" />
                                    ການຕັ້ງຄ່າຄວາມປອດໄພ
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Two-Factor Authentication</Label>
                                            <p className="text-sm text-muted-foreground">
                                                ໃຊ້ການຢືນຢັນ 2 ຂັ້ນຕອນ
                                            </p>
                                        </div>
                                        <Switch
                                            checked={securitySettings.twoFactorAuth}
                                            onCheckedChange={(checked) =>
                                                setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>SSL/TLS Encryption</Label>
                                            <p className="text-sm text-muted-foreground">
                                                ເຂົ້າລະຫັດການເຊື່ອມຕໍ່
                                            </p>
                                        </div>
                                        <Switch
                                            checked={securitySettings.sslEnabled}
                                            onCheckedChange={(checked) =>
                                                setSecuritySettings({ ...securitySettings, sslEnabled: checked })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="sessionTimeout">ເວລາ Session (ນາທີ)</Label>
                                        <Input
                                            id="sessionTimeout"
                                            type="number"
                                            value={securitySettings.sessionTimeout}
                                            onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                                            placeholder="30"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="passwordMinLength">ຄວາມຍາວລະຫັດຜ່ານຂັ້ນຕໍ່າ</Label>
                                        <Input
                                            id="passwordMinLength"
                                            type="number"
                                            value={securitySettings.passwordMinLength}
                                            onChange={(e) => setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(e.target.value) })}
                                            placeholder="8"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                                    <Textarea
                                        id="ipWhitelist"
                                        value={securitySettings.ipWhitelist}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, ipWhitelist: e.target.value })}
                                        placeholder="192.168.1.1&#10;10.0.0.1"
                                        rows={3}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        ປ້ອນ IP addresses ທີ່ອະນຸຍາດ (ແຕ່ລະບໍລິເວນ 1 ແຖວ)
                                    </p>
                                </div>

                                <Button
                                    onClick={() => handleSaveSettings("security")}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    ບັນທຶກການຕັ້ງຄ່າຄວາມປອດໄພ
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Notification Settings */}
                    {activeTab === "notifications" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Bell className="mr-2 h-5 w-5" />
                                    ການຕັ້ງຄ່າການແຈ້ງເຕືອນ
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>ການແຈ້ງເຕືອນທາງອີເມລ</Label>
                                            <p className="text-sm text-muted-foreground">
                                                ແຈ້ງເຕືອນຜ່ານອີເມລ
                                            </p>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.emailNotifications}
                                            onCheckedChange={(checked) =>
                                                setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>ແຈ້ງຄຳສັ່ງຊື້ໃໝ່</Label>
                                            <p className="text-sm text-muted-foreground">
                                                ແຈ້ງເວລາມີຄຳສັ່ງຊື້ໃໝ່
                                            </p>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.orderNotifications}
                                            onCheckedChange={(checked) =>
                                                setNotificationSettings({ ...notificationSettings, orderNotifications: checked })
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>ແຈ້ງລູກຄ້າໃໝ່</Label>
                                            <p className="text-sm text-muted-foreground">
                                                ແຈ້ງເວລາມີລູກຄ້າລົງທະບຽນໃໝ່
                                            </p>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.customerNotifications}
                                            onCheckedChange={(checked) =>
                                                setNotificationSettings({ ...notificationSettings, customerNotifications: checked })
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>ແຈ້ງສິນຄ້າເຫຼືອໜ້ອຍ</Label>
                                            <p className="text-sm text-muted-foreground">
                                                ແຈ້ງເວລາສິນຄ້າເຫຼືອໜ້ອຍ
                                            </p>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.lowStockAlerts}
                                            onCheckedChange={(checked) =>
                                                setNotificationSettings({ ...notificationSettings, lowStockAlerts: checked })
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>ລາຍງານປະຈຳອາທິດ</Label>
                                            <p className="text-sm text-muted-foreground">
                                                ສົ່ງລາຍງານປະຈຳອາທິດ
                                            </p>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.weeklyReports}
                                            onCheckedChange={(checked) =>
                                                setNotificationSettings({ ...notificationSettings, weeklyReports: checked })
                                            }
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleSaveSettings("notifications")}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    ບັນທຶກການຕັ້ງຄ່າການແຈ້ງເຕືອນ
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* System Settings */}
                    {activeTab === "system" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Database className="mr-2 h-5 w-5" />
                                    ການຕັ້ງຄ່າລະບົບ
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>ໂໝດບຳລຸງລະບົບ</Label>
                                            <p className="text-sm text-muted-foreground">
                                                ເປີດໃຊ້ໂໝດບຳລຸງລະບົບ
                                            </p>
                                        </div>
                                        <Switch
                                            checked={systemSettings.maintenanceMode}
                                            onCheckedChange={(checked) =>
                                                setSystemSettings({ ...systemSettings, maintenanceMode: checked })
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>ໂໝດ Debug</Label>
                                            <p className="text-sm text-muted-foreground">
                                                ເປີດໃຊ້ໂໝດ Debug
                                            </p>
                                        </div>
                                        <Switch
                                            checked={systemSettings.debugMode}
                                            onCheckedChange={(checked) =>
                                                setSystemSettings({ ...systemSettings, debugMode: checked })
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>ການ Backup ອັດຕະໂນມັດ</Label>
                                            <p className="text-sm text-muted-foreground">
                                                ສ້າງ Backup ອັດຕະໂນມັດ
                                            </p>
                                        </div>
                                        <Switch
                                            checked={systemSettings.autoBackup}
                                            onCheckedChange={(checked) =>
                                                setSystemSettings({ ...systemSettings, autoBackup: checked })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="backupFrequency">ຄວາມຖີ່ການ Backup</Label>
                                        <Select
                                            value={systemSettings.backupFrequency}
                                            onChange={(value) => setSystemSettings({ ...systemSettings, backupFrequency: value.toString() })}
                                            options={[
                                                { value: "daily", label: "ປະຈຳວັນ" },
                                                { value: "weekly", label: "ປະຈຳອາທິດ" },
                                                { value: "monthly", label: "ປະຈຳເດືອນ" }
                                            ]}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="maxFileSize">ຂະໜາດໄຟລ໌ສູງສຸດ (MB)</Label>
                                        <Input
                                            id="maxFileSize"
                                            type="number"
                                            value={systemSettings.maxFileSize}
                                            onChange={(e) => setSystemSettings({ ...systemSettings, maxFileSize: parseInt(e.target.value) })}
                                            placeholder="10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="allowedFileTypes">ປະເພດໄຟລ໌ທີ່ອະນຍາດ</Label>
                                    <Input
                                        id="allowedFileTypes"
                                        value={systemSettings.allowedFileTypes}
                                        onChange={(e) => setSystemSettings({ ...systemSettings, allowedFileTypes: e.target.value })}
                                        placeholder="jpg,jpeg,png,pdf"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        ກຳນົດປະເພດໄຟລ໌ທີ່ອະນຍາດ (ຄັດເຫມາະດ້ວຍຈຸດ)
                                    </p>
                                </div>

                                <div className="flex space-x-4">
                                    <Button
                                        onClick={() => handleSaveSettings("system")}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="mr-2 h-4 w-4" />
                                        )}
                                        ບັນທຶກການຕັ້ງຄ່າລະບົບ
                                    </Button>
                                    <Button variant="outline">
                                        <Upload className="mr-2 h-4 w-4" />
                                        ສ້າງ Backup
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
