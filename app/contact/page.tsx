"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false)
            setSubmitSuccess(true)
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" })

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitSuccess(false), 5000)
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                        ຕິດຕໍ່ພວກເຮົາ
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        ພວກເຮົາຍິນດີຮັບຟັງຄວາມຄິດເຫັນ ແລະ ຄຳຖາມຈາກທ່ານ
                    </p>
                </div>
            </section>

            {/* Contact Info & Form Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Information */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">ຂໍ້ມູນຕິດຕໍ່</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-sm mb-1">ທີ່ຢູ່</p>
                                            <p className="text-sm text-muted-foreground">
                                                ບ້ານໂພນທັນ, ເມືອງໄຊເສດຖາ<br />
                                                ນະຄອນຫຼວງວຽງຈັນ<br />
                                                ສປປ ລາວ
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-sm mb-1">ໂທລະສັບ</p>
                                            <p className="text-sm text-muted-foreground">
                                                +856 20 5555 5555<br />
                                                +856 21 123 456
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-sm mb-1">ຊື່ຜູ້ໃຊ້ງານ</p>
                                            <p className="text-sm text-muted-foreground">
                                                info@khaodee.com<br />
                                                support@khaodee.com
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-sm mb-1">ເວລາເຮັດວຽກ</p>
                                            <p className="text-sm text-muted-foreground">
                                                ຈັນ - ສຸກ: 8:00 - 17:00<br />
                                                ເສົາ: 8:00 - 12:00<br />
                                                ອາທິດ: ປິດ
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Map Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">ແຜນທີ່</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                        <MapPin className="w-12 h-12 text-muted-foreground" />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 text-center">
                                        ແຜນທີ່ຕັ້ງຢູ່ໃຈກາງເມືອງວຽງຈັນ
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl font-playfair">ສົ່ງຂໍ້ຄວາມຫາພວກເຮົາ</CardTitle>
                                    <CardDescription>
                                        ກະລຸນາຕື່ມຂໍ້ມູນໃຫ້ຄົບຖ້ວນ ພວກເຮົາຈະຕອບກັບໄວທີ່ສຸດ
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {submitSuccess && (
                                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                                            ✓ ຂໍ້ຄວາມຂອງທ່ານຖືກສົ່ງສຳເລັດແລ້ວ! ພວກເຮົາຈະຕິດຕໍ່ກັບທ່ານໃນໄວໆນີ້.
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">ຊື່ ແລະ ນາມສະກຸນ *</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    placeholder="ກະລຸນາໃສ່ຊື່"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">ເບີໂທລະສັບ *</Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="020 xxxx xxxx"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">ອີເມລ *</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="example@email.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">ຫົວຂໍ້ *</Label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                placeholder="ເລື່ອງທີ່ຕ້ອງການສອບຖາມ"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">ຂໍ້ຄວາມ *</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="ກະລຸນາໃສ່ຂໍ້ຄວາມຂອງທ່ານ..."
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={6}
                                                required
                                            />
                                        </div>

                                        <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>ກຳລັງສົ່ງ...</>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    ສົ່ງຂໍ້ຄວາມ
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="font-playfair text-3xl font-bold text-foreground text-center mb-12">
                        ຄຳຖາມທີ່ພົບເລື້ອຍ
                    </h2>
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">ເວລາຈັດສົ່ງສິນຄ້ານານປານໃດ?</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                ປົກກະຕິພວກເຮົາຈັດສົ່ງພາຍໃນ 1-2 ວັນເຮັດວຽກສຳລັບໃນນະຄອນຫຼວງວຽງຈັນ ແລະ 3-5 ວັນສຳລັບຕ່າງແຂວງ.
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">ມີຄ່າຈັດສົ່ງບໍ່?</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                ຟຣີຄ່າຈັດສົ່ງສຳລັບການສັ່ງຊື້ຫຼາຍກວ່າ 200,000 ກີບ. ຕໍ່າກວ່ານີ້ມີຄ່າຈັດສົ່ງ 20,000 ກີບ.
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">ສາມາດຄືນສິນຄ້າໄດ້ບໍ່?</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                ສາມາດຄືນສິນຄ້າໄດ້ພາຍໃນ 7 ວັນ ຖ້າສິນຄ້າມີບັນຫາ ຫຼື ບໍ່ຕົງກັບທີ່ສັ່ງ. ກະລຸນາຕິດຕໍ່ພວກເຮົາທັນທີ.
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">ຮັບການຊຳລະເງິນແບບໃດແດ່?</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                ພວກເຮົາຮັບການຊຳລະເງິນແບບ: ເງິນສົດ, ໂອນເງິນຜ່ານທະນາຄານ, BCEL One, ແລະ LDB Trust.
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/40 py-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center text-sm text-muted-foreground">
                        <p>&copy; 2024 ເຂົ້າດີ. ລິຂະສິດທຸກຢ່າງສະຫງວນໄວ້.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

