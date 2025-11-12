"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { fetchCustomerByIdAPI, updateCustomerAPI } from "@/lib/api"
import { User, MapPin, Lock, Save, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AccountPage() {
  const { user, isAuthenticated, updateProfile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("info")

  // Customer Info State
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })

  // Shipping Address State
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Laos",
  })

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    loadCustomerData()
  }, [isAuthenticated, user])

  const loadCustomerData = async () => {
    if (!user?.id) return

    setIsLoadingData(true)
    try {
      // Try to fetch from backend
      const customerId = user.id
      const res = await fetchCustomerByIdAPI(customerId)

      if (res.success && res.customer) {
        const customer = res.customer
        setCustomerInfo({
          name: customer.name || "",
          email: customer.email || "",
          phone: customer.phone || "",
        })

        // Parse address if it exists
        if (customer.address) {
          try {
            const addr = typeof customer.address === 'string'
              ? JSON.parse(customer.address)
              : customer.address

            if (addr && typeof addr === 'object') {
              setShippingAddress({
                street: addr.street || addr.address || addr.address_line1 || "",
                city: addr.city || addr.town || "",
                state: addr.state || addr.province || "",
                zipCode: addr.zipCode || addr.zip_code || addr.postal_code || "",
                country: addr.country || "Laos",
              })
            }
          } catch {
            // If address is a plain string, use it as street
            setShippingAddress(prev => ({
              ...prev,
              street: typeof customer.address === 'string' ? customer.address : "",
            }))
          }
        }
      } else {
        // Fallback to user data from context
        setCustomerInfo({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        })
        if (user.address) {
          setShippingAddress({
            street: user.address.street || "",
            city: user.address.city || "",
            state: user.address.state || "",
            zipCode: user.address.zipCode || "",
            country: user.address.country || "Laos",
          })
        }
      }
    } catch (err) {
      console.error("Error loading customer data:", err)
      // Fallback to user data from context
      if (user) {
        setCustomerInfo({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        })
        if (user.address) {
          setShippingAddress({
            street: user.address.street || "",
            city: user.address.city || "",
            state: user.address.state || "",
            zipCode: user.address.zipCode || "",
            country: user.address.country || "Laos",
          })
        }
      }
    } finally {
      setIsLoadingData(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  const handleCustomerInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)
    setError("")

    try {
      if (!user?.id) {
        throw new Error("User ID not found")
      }

      const updates = {
        name: customerInfo.name.trim(),
        email: customerInfo.email.trim(),
        phone: customerInfo.phone.trim(),
      }

      const res = await updateCustomerAPI(user.id, updates)

      if (res.success && res.customer) {
        // Update local user context
        updateProfile({
          name: res.customer.name,
          email: res.customer.email,
          phone: res.customer.phone,
        })
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        throw new Error(res.error || "Failed to update customer info")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update customer information")
    } finally {
      setIsLoading(false)
    }
  }

  const handleShippingAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)
    setError("")

    try {
      if (!user?.id) {
        throw new Error("User ID not found")
      }

      const addressString = JSON.stringify({
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        zipCode: shippingAddress.zipCode.trim(),
        country: shippingAddress.country.trim(),
      })

      const res = await updateCustomerAPI(user.id, {
        address: addressString,
      })

      if (res.success) {
        // Update local user context
        updateProfile({
          address: {
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zipCode: shippingAddress.zipCode,
            country: shippingAddress.country,
          },
        })
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        throw new Error(res.error || "Failed to update shipping address")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update shipping address")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)
    setError("")

    // Validation
    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      if (!user?.id) {
        throw new Error("User ID not found")
      }

      const res = await updateCustomerAPI(user.id, {
        password: passwordData.newPassword,
      })

      if (res.success) {
        setSuccess(true)
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        setTimeout(() => setSuccess(false), 3000)
      } else {
        throw new Error(res.error || "Failed to change password")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your account information...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">ຕັ້ງຄ່າບັນຊີ</h1>
            <p className="text-muted-foreground">ຈັດການຂໍ້ມູນສ່ວນຕົວ ແລະ ທີ່ຢູ່ຈັດສົ່ງຂອງທ່ານ</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-white">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">ຂໍ້ມູນສ່ວນຕົວ</span>
                <span className="sm:hidden">ຂໍ້ມູນ</span>
              </TabsTrigger>
              <TabsTrigger value="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">ທີ່ຢູ່ຈັດສົ່ງ</span>
                <span className="sm:hidden">ທີ່ຢູ່</span>
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">ປ່ຽນລະຫັດຜ່ານ</span>
                <span className="sm:hidden">ລະຫັດ</span>
              </TabsTrigger>
            </TabsList>

            {/* Customer Info Tab */}
            <TabsContent value="info">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>ຂໍ້ມູນສ່ວນຕົວ</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCustomerInfoSubmit} className="space-y-4">
                    {success && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          ອັບເດດຂໍ້ມູນສຳເລັດແລ້ວ!
                        </AlertDescription>
                      </Alert>
                    )}
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">ຊື່ເຕັມ</Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">ອີເມວ</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">ເບີໂທ</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        placeholder="020-1234567"
                        className="mt-1"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ກຳລັງບັນທຶກ...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            ບັນທຶກ
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shipping Address Tab */}
            <TabsContent value="address">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>ທີ່ຢູ່ຈັດສົ່ງ</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingAddressSubmit} className="space-y-4">
                    {success && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          ອັບເດດທີ່ຢູ່ສຳເລັດແລ້ວ!
                        </AlertDescription>
                      </Alert>
                    )}
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div>
                      <Label htmlFor="street">ຖະໜົນ / ບ້ານ</Label>
                      <Input
                        id="street"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                        placeholder="123 Main Street"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">ເມືອງ</Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          placeholder="Vientiane"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">ແຂວງ</Label>
                        <Input
                          id="state"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                          placeholder="Vientiane Capital"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">ລະຫັດໄປສະນີ</Label>
                        <Input
                          id="zipCode"
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                          placeholder="01000"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">ປະເທດ</Label>
                        <Input
                          id="country"
                          value={shippingAddress.country}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ກຳລັງບັນທຶກ...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            ບັນທຶກ
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Change Password Tab */}
            <TabsContent value="password">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-primary" />
                    <span>ປ່ຽນລະຫັດຜ່ານ</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    {success && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          ປ່ຽນລະຫັດຜ່ານສຳເລັດແລ້ວ!
                        </AlertDescription>
                      </Alert>
                    )}
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div>
                      <Label htmlFor="currentPassword">ລະຫັດຜ່ານປັດຈຸບັນ</Label>
                      <div className="relative mt-1">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="newPassword">ລະຫັດຜ່ານໃໝ່</Label>
                      <div className="relative mt-1">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="pr-10"
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">ຢືນຢັນລະຫັດຜ່ານໃໝ່</Label>
                      <div className="relative mt-1">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="pr-10"
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ກຳລັງບັນທຶກ...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            ປ່ຽນລະຫັດຜ່ານ
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
