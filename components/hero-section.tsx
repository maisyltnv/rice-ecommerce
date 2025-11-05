import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="/premium-rice-grains-in-wooden-bowl-on-natural-back.jpg" alt="ຂ້າວຊັ້ນດີຫຼາກຫຼາຍ" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            ຂ້າວມໍລະດົກຊັ້ນດີ ພ້ອມຄຸນນະພາບທັນສະໄໝ
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            ຄົ້ນພົບຄັງຂ້າວຊັ້ນດີທີ່ຄັດເລືອກຢ່າງປະນີດ ມາຈາກຟາມມໍລະດົກ ແລະສົ່ງສົດເຖິງໂຕະອາຫານຂອງທ່ານ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="text-base">
                ຊື້ຂ້າວຊັ້ນດີ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="text-base bg-transparent">
                ຮູ້ຈັກເຮົາເພີ່ມ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
