"use client"

import React, { useState, useEffect } from "react"
import {
  getAllProducts,
  deleteProduct,
  type Product,
  type CreateProductRequest
} from "@/lib/products-api"
import { getAllCategories, type Category } from "@/lib/categories-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Search,
  RefreshCw
} from "lucide-react"
import { useToast } from "@/components/ui/toast"
import { Select } from "@/components/ui/select"

interface ProductFormData {
  name: string
  price: string
  description: string
  category: string
  category_id: string
  stock: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const { addToast } = useToast()

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    description: "",
    category: "",
    category_id: "",
    stock: ""
  })

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)

    try {
      const result = await getAllProducts()
      console.log('API Result:', result)
      console.log('Products data:', result.data)
      console.log('Products length:', result.data?.length)

      if (result.success && result.data) {
        setProducts(result.data)
        // Only show success toast if there are products
        if (result.data.length > 0) {
          addToast({
            type: 'success',
            title: 'ໂຫຼດຂໍ້ມູນສຳເລັດ',
            description: `ພົບສິນຄ້າ ${result.data.length} ລາຍການ`,
            duration: 2000
          })
        }
      } else {
        addToast({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          description: result.error || "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນຈາກຖານຂໍ້ມູນ",
          duration: 5000
        })
      }
    } catch (err) {
      console.error('Network error:', err)
      addToast({
        type: 'error',
        title: 'ເກີດຂໍ້ຜິດພາດ',
        description: `ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບຖານຂໍ້ມູນ: ${err instanceof Error ? err.message : 'Unknown error'}`,
        duration: 5000
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...')
      const result = await getAllCategories()
      console.log('Categories result:', result)
      if (result.success && result.data) {
        console.log('Categories data:', result.data)
        setCategories(result.data)
      } else {
        console.error('Failed to fetch categories:', result.error)
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບສິນຄ້າ "${name || 'ສິນຄ້ານີ້'}"?`)) {
      return
    }

    try {
      const result = await deleteProduct(id)
      if (result.success) {
        setProducts(products.filter(p => p.id !== id))
        addToast({
          type: 'success',
          title: 'ລຶບສິນຄ້າສຳເລັດ',
          description: `ລຶບສິນຄ້າ "${name}" ສຳເລັດແລ້ວ`,
          duration: 3000
        })
      } else {
        addToast({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          description: result.error || "ເກີດຂໍ້ຜິດພາດໃນການລຶບສິນຄ້າ",
          duration: 5000
        })
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'ເກີດຂໍ້ຜິດພາດ',
        description: "ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່",
        duration: 5000
      })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || "",
      price: (product.price || 0).toString(),
      description: product.description || "",
      category: typeof product.category === 'string' ? product.category : product.category?.name || "",
      category_id: product.category_id?.toString() || "",
      stock: product.stock?.toString() || ""
    })
    setShowForm(true)
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      category_id: "",
      stock: ""
    })
    setShowForm(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const productData: CreateProductRequest = {
        name: formData.name.trim(),
        price: parseFloat(formData.price) || 0,
        // description: formData.description.trim() || undefined,
        // category: formData.category.trim() || undefined,
        category_id: formData.category_id && formData.category_id !== "" ? parseInt(formData.category_id) : null,
        // stock: formData.stock ? parseInt(formData.stock) || 0 : undefined
      }

      console.log('Form data:', formData)
      console.log('Product data to send:', productData)

      // Validate required fields
      if (!productData.name || productData.name.trim() === "") {
        addToast({
          type: 'error',
          title: 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
          description: "ກະລຸນາປ້ອນຊື່ສິນຄ້າ",
          duration: 3000
        })
        return
      }
      if (!productData.price || productData.price <= 0 || isNaN(productData.price)) {
        addToast({
          type: 'error',
          title: 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
          description: "ກະລຸນາປ້ອນລາຄາທີ່ຖືກຕ້ອງ (ຕ້ອງເປັນຕົວເລກ)",
          duration: 3000
        })
        return
      }

      if (editingProduct) {
        // Update existing product
        console.log('Updating product:', editingProduct.id, productData)
        const { updateProduct } = await import("@/lib/products-api")
        const result = await updateProduct(editingProduct.id, productData)
        console.log('Update result:', result)

        if (result.success && result.data) {
          setProducts(products.map(p => p.id === editingProduct.id ? result.data! : p))
          addToast({
            type: 'success',
            title: 'ອັບເດດສິນຄ້າສຳເລັດ',
            description: `ອັບເດດສິນຄ້າ "${productData.name}" ສຳເລັດແລ້ວ`,
            duration: 3000
          })
          setShowForm(false)
        } else {
          addToast({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            description: result.error || "ເກີດຂໍ້ຜິດພາດໃນການອັບເດດສິນຄ້າ",
            duration: 5000
          })
        }
      } else {
        // Create new product
        console.log('Creating new product:', productData)
        const { createProduct } = await import("@/lib/products-api")
        const result = await createProduct(productData)
        console.log('Create result:', result)

        if (result.success && result.data) {
          setProducts([...products, result.data])
          addToast({
            type: 'success',
            title: 'ເພີ່ມສິນຄ້າສຳເລັດ',
            description: `ເພີ່ມສິນຄ້າ "${productData.name}" ສຳເລັດແລ້ວ`,
            duration: 3000
          })
          setShowForm(false)
        } else {
          addToast({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            description: result.error || "ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມສິນຄ້າ",
            duration: 5000
          })
        }
      }
    } catch (err) {
      console.error('Form submit error:', err)
      addToast({
        type: 'error',
        title: 'ເກີດຂໍ້ຜິດພາດ',
        description: `ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່: ${err instanceof Error ? err.message : 'Unknown error'}`,
        duration: 5000
      })
    } finally {
      setFormLoading(false)
    }
  }

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    if (!product || !product.name) return false

    const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const categoryMatch = product.category &&
      (typeof product.category === 'string' ?
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) :
        product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()))

    return nameMatch || categoryMatch
  })

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>ກຳລັງໂຫຼດຂໍ້ມູນສິນຄ້າ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 pt-20 md:pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">ຈັດການສິນຄ້າ</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">ຈັດການສິນຄ້າທັງໝົດໃນລະບົບ</p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          ເພີ່ມສິນຄ້າໃໝ່
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="ຄົ້ນຫາສິນຄ້າ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>


      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold line-clamp-1">
                  {product.name || 'ບໍ່ມີຊື່'}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.id, product.name || 'ສິນຄ້ານີ້')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {typeof product.category === 'string' ? product.category :
                      typeof product.category === 'object' ? product.category?.name || "ບໍ່ມີໝວດໝູ່" :
                        "ບໍ່ມີໝວດໝູ່"}
                    {product.category_id && (
                      <span className="ml-1 text-xs text-gray-400">(ID: {product.category_id})</span>
                    )}
                  </span>
                </div>

                <div className="text-2xl font-bold text-primary">
                  {formatPrice(product.price || 0)}
                </div>

                {product.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {product.stock !== undefined && (
                  <div className="text-sm">
                    <span className="text-gray-600">ສະຕ໋ອກ:</span>
                    <span className={`ml-2 font-medium ${product.stock > 10 ? 'text-green-600' :
                      product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                      {product.stock} ຊິ້ນ
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ບໍ່ມີສິນຄ້າ
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "ບໍ່ພົບສິນຄ້າທີ່ຄົ້ນຫາ" : "ເລີ່ມເພີ່ມສິນຄ້າໃໝ່"}
            </p>
            {!searchTerm && (
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                ເພີ່ມສິນຄ້າໃໝ່
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingProduct ? "ແກ້ໄຂສິນຄ້າ" : "ເພີ່ມສິນຄ້າໃໝ່"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">ຊື່ສິນຄ້າ *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="ປ້ອນຊື່ສິນຄ້າ"
                  />
                </div>

                <div>
                  <Label htmlFor="price">ລາຄາ (ກີບ) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="ປ້ອນລາຄາ"
                  />
                </div>

                <div>
                  <Label htmlFor="category_id">ໝວດໝູ່ສິນຄ້າ</Label>
                  <div className="mb-2 text-xs text-gray-500">
                    Categories loaded: {categories.length}
                  </div>
                  <Select
                    value={formData.category_id}
                    onChange={(value) => {
                      console.log('Category selected:', value)
                      const selectedCategory = categories.find(c => c.id.toString() === value.toString())
                      console.log('Selected category:', selectedCategory)

                      // Fallback category names if categories not loaded
                      const fallbackCategories: { [key: string]: string } = {
                        "1": "ເຄື່ອງດື່ມ",
                        "2": "ອາຫານ",
                        "3": "ຂອງຫວານ"
                      }

                      setFormData({
                        ...formData,
                        category_id: value.toString(),
                        category: selectedCategory?.name || fallbackCategories[value.toString()] || ""
                      })
                    }}
                    options={[
                      { value: "", label: "ເລືອກໝວດໝູ່..." },
                      ...(categories.length > 0 ? categories.map(category => ({
                        value: category.id,
                        label: category.name
                      })) : [
                        { value: "1", label: "ເຄື່ອງດື່ມ" },
                        { value: "2", label: "ອາຫານ" },
                        { value: "3", label: "ຂອງຫວານ" }
                      ])
                    ]}
                    placeholder="ເລືອກໝວດໝູ່..."
                  />
                </div>

                <div>
                  <Label htmlFor="stock">ຈຳນວນສະຕ໋ອກ</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="ປ້ອນຈຳນວນສະຕ໋ອກ"
                  />
                </div>

                <div>
                  <Label htmlFor="description">ລາຍລະອຽດ</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="ປ້ອນລາຍລະອຽດສິນຄ້າ"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1"
                  >
                    {formLoading ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    ຍົກເລີກ
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}