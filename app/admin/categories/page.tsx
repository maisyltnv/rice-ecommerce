"use client"

import React, { useState, useEffect } from "react"
import {
    getAllCategories,
    deleteCategory,
    type Category,
    type CreateCategoryRequest
} from "@/lib/categories-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Plus,
    Edit,
    Trash2,
    FolderOpen,
    Search,
    RefreshCw
} from "lucide-react"
import { useToast } from "@/components/ui/toast"

interface CategoryFormData {
    name: string
    description: string
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [formLoading, setFormLoading] = useState(false)
    const { addToast } = useToast()

    const [formData, setFormData] = useState<CategoryFormData>({
        name: "",
        description: ""
    })

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        setLoading(true)

        try {
            const result = await getAllCategories()
            console.log('Categories API Result:', result)

            if (result.success && result.data) {
                setCategories(result.data)
                if (result.data.length > 0) {
                    addToast({
                        type: 'success',
                        title: 'ໂຫຼດຂໍ້ມູນສຳເລັດ',
                        description: `ພົບໝວດໝູ່ ${result.data.length} ລາຍການ`,
                        duration: 2000
                    })
                }
            } else {
                addToast({
                    type: 'error',
                    title: 'ເກີດຂໍ້ຜິດພາດ',
                    description: result.error || "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນໝວດໝູ່",
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

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບໝວດໝູ່ "${name || 'ໝວດໝູ່ນີ້'}"?`)) {
            return
        }

        try {
            const result = await deleteCategory(id)
            if (result.success) {
                setCategories(categories.filter(c => c.id !== id))
                addToast({
                    type: 'success',
                    title: 'ລຶບໝວດໝູ່ສຳເລັດ',
                    description: `ລຶບໝວດໝູ່ "${name}" ສຳເລັດແລ້ວ`,
                    duration: 3000
                })
            } else {
                addToast({
                    type: 'error',
                    title: 'ເກີດຂໍ້ຜິດພາດ',
                    description: result.error || "ເກີດຂໍ້ຜິດພາດໃນການລຶບໝວດໝູ່",
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

    const handleEdit = (category: Category) => {
        setEditingCategory(category)
        setFormData({
            name: category.name || "",
            description: category.description || ""
        })
        setShowForm(true)
    }

    const handleAddNew = () => {
        setEditingCategory(null)
        setFormData({
            name: "",
            description: ""
        })
        setShowForm(true)
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormLoading(true)

        try {
            const categoryData: CreateCategoryRequest = {
                name: formData.name.trim(),
                description: formData.description.trim() || undefined
            }

            // Validate required fields
            if (!categoryData.name) {
                addToast({
                    type: 'error',
                    title: 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
                    description: "ກະລຸນາປ້ອນຊື່ໝວດໝູ່",
                    duration: 3000
                })
                return
            }

            if (editingCategory) {
                // Update existing category
                const { updateCategory } = await import("@/lib/categories-api")
                const result = await updateCategory(editingCategory.id, categoryData)

                if (result.success && result.data) {
                    setCategories(categories.map(c => c.id === editingCategory.id ? result.data! : c))
                    addToast({
                        type: 'success',
                        title: 'ອັບເດດໝວດໝູ່ສຳເລັດ',
                        description: `ອັບເດດໝວດໝູ່ "${categoryData.name}" ສຳເລັດແລ້ວ`,
                        duration: 3000
                    })
                    setShowForm(false)
                } else {
                    addToast({
                        type: 'error',
                        title: 'ເກີດຂໍ້ຜິດພາດ',
                        description: result.error || "ເກີດຂໍ້ຜິດພາດໃນການອັບເດດໝວດໝູ່",
                        duration: 5000
                    })
                }
            } else {
                // Create new category
                const { createCategory } = await import("@/lib/categories-api")
                const result = await createCategory(categoryData)

                if (result.success && result.data) {
                    setCategories([...categories, result.data])
                    addToast({
                        type: 'success',
                        title: 'ເພີ່ມໝວດໝູ່ສຳເລັດ',
                        description: `ເພີ່ມໝວດໝູ່ "${categoryData.name}" ສຳເລັດແລ້ວ`,
                        duration: 3000
                    })
                    setShowForm(false)
                } else {
                    addToast({
                        type: 'error',
                        title: 'ເກີດຂໍ້ຜິດພາດ',
                        description: result.error || "ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມໝວດໝູ່",
                        duration: 5000
                    })
                }
            }
        } catch (err) {
            addToast({
                type: 'error',
                title: 'ເກີດຂໍ້ຜິດພາດ',
                description: "ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່",
                duration: 5000
            })
        } finally {
            setFormLoading(false)
        }
    }

    // Filter categories based on search term
    const filteredCategories = categories.filter(category =>
        category && category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>ກຳລັງໂຫຼດຂໍ້ມູນໝວດໝູ່...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">ຈັດການໝວດໝູ່ສິນຄ້າ</h1>
                    <p className="text-gray-600 mt-1">ຈັດການໝວດໝູ່ສິນຄ້າທັງໝົດໃນລະບົບ</p>
                </div>
                <Button onClick={handleAddNew} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    ເພີ່ມໝວດໝູ່ໃໝ່
                </Button>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="ຄົ້ນຫາໝວດໝູ່..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                    <Card key={category.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold line-clamp-1 flex items-center gap-2">
                                    <FolderOpen className="h-5 w-5 text-blue-500" />
                                    {category.name || 'ບໍ່ມີຊື່'}
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEdit(category)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDelete(category.id, category.name || 'ໝວດໝູ່ນີ້')}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {category.description && (
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {category.description}
                                    </p>
                                )}

                                <div className="text-sm text-gray-500">
                                    ID: {category.id}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredCategories.length === 0 && !loading && (
                <Card>
                    <CardContent className="text-center py-12">
                        <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            ບໍ່ມີໝວດໝູ່
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm ? "ບໍ່ພົບໝວດໝູ່ທີ່ຄົ້ນຫາ" : "ເລີ່ມເພີ່ມໝວດໝູ່ໃໝ່"}
                        </p>
                        {!searchTerm && (
                            <Button onClick={handleAddNew}>
                                <Plus className="h-4 w-4 mr-2" />
                                ເພີ່ມໝວດໝູ່ໃໝ່
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Category Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <CardHeader>
                            <CardTitle>
                                {editingCategory ? "ແກ້ໄຂໝວດໝູ່" : "ເພີ່ມໝວດໝູ່ໃໝ່"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">ຊື່ໝວດໝູ່ *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="ປ້ອນຊື່ໝວດໝູ່"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">ລາຍລະອຽດ</Label>
                                    <textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="ປ້ອນລາຍລະອຽດໝວດໝູ່"
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
