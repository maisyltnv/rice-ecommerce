import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Award, Users, Leaf, Heart } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                        ກ່ຽວກັບເຮົາ
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        ບໍລິສັດເຂົ້າດີ ເປັນຜູ້ນໍາທາງດ້ານການຈັດຈໍາໜ່າຍເຂົ້າຄຸນນະພາບສູງ ທີ່ມີປະຫວັດສາດອັນຍາວນານ
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-4xl">
                    <div className="prose prose-lg max-w-none">
                        <h2 className="font-playfair text-3xl font-bold text-foreground mb-6">
                            ເລື່ອງລາວຂອງພວກເຮົາ
                        </h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            ດ້ວຍປະສົບການຫລາຍກວ່າ 50 ປີໃນການຄັດເລືອກແລະຈັດຈໍາໜ່າຍເຂົ້າຄຸນນະພາບດີ ພວກເຮົາມີຄວາມພາກພູມໃຈທີ່ໄດ້ນໍາສະເໜີເຂົ້າທີ່ດີທີ່ສຸດຈາກທົ່ວພາກພື້ນສູ່ໂຕະອາຫານຂອງທ່ານ.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            ພວກເຮົາເຊື່ອວ່າເຂົ້າບໍ່ພຽງແຕ່ເປັນອາຫານ ແຕ່ຍັງເປັນມໍລະດົກວັດທະນະທໍາທີ່ສໍາຄັນ. ດ້ວຍເຫດນີ້ ພວກເຮົາຈຶ່ງອຸທິດຕົນເພື່ອຮັກສາຄຸນນະພາບແລະຄວາມອາສວາດຂອງເຂົ້າທຸກເມັດ.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="font-playfair text-3xl font-bold text-foreground text-center mb-12">
                        ຄຸນຄ່າຂອງພວກເຮົາ
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                <Award className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">ຄຸນນະພາບສູງ</h3>
                            <p className="text-sm text-muted-foreground">
                                ຄັດເລືອກເຂົ້າທີ່ດີທີ່ສຸດຈາກຟາມທີ່ມີຄຸນນະພາບ
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                <Leaf className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">ເປັນມິດກັບສິ່ງແວດລ້ອມ</h3>
                            <p className="text-sm text-muted-foreground">
                                ສົ່ງເສີມການປູກເຂົ້າແບບຍືນຍົງ
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                <Users className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">ສະໜັບສະໜູນຊຸມຊົນ</h3>
                            <p className="text-sm text-muted-foreground">
                                ຊ່ວຍເຫຼືອຊາວນາທ້ອງຖິ່ນໃຫ້ມີຊີວິດທີ່ດີຂຶ້ນ
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                <Heart className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">ຄວາມຮັກໃນວຽກ</h3>
                            <p className="text-sm text-muted-foreground">
                                ອຸທິດຕົນດ້ວຍຄວາມຮັກໃນທຸກລາຍລະອຽດ
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="font-playfair text-3xl font-bold text-foreground text-center mb-6">
                        ພາລະກິດຂອງພວກເຮົາ
                    </h2>
                    <p className="text-center text-muted-foreground leading-relaxed mb-8">
                        ພວກເຮົາມີຄວາມມຸ່ງໝັ້ນທີ່ຈະນໍາສະເໜີເຂົ້າຄຸນນະພາບດີທີ່ສຸດ ດ້ວຍການຄັດເລືອກຈາກແຫຼ່ງທີ່ເຊື່ອຖືໄດ້ ແລະ ຮັກສາມາດຕະຖານສູງສຸດໃນທຸກຂັ້ນຕອນການຜະລິດ.
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="font-playfair text-3xl font-bold text-foreground mb-6">
                        ພ້ອມທີ່ຈະລອງເຂົ້າຂອງພວກເຮົາບໍ?
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        ສໍາຫຼວດຄໍເລັກຊັນເຂົ້າຄຸນນະພາບສູງຂອງພວກເຮົາ
                    </p>
                    <Link href="/products">
                        <Button size="lg" className="text-base">
                            ເບິ່ງສິນຄ້າທັງໝົດ
                        </Button>
                    </Link>
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

