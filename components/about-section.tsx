import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Award, Truck } from "lucide-react"

const features = [
  {
    icon: Leaf,
    title: "ແຫຼ່ງຜະລິດທີ່ຍືນຍົງ",
    description:
      "ຮ່ວມມືໂດຍກົງກັບຟາມມໍລະດົກ ທີ່ປະຕິບັດການເກດຕະກໍາຍືນຍົງ ແລະວິທີປູກແບບດັ້ງເດີມ.",
  },
  {
    icon: Award,
    title: "ຄຸນນະພາບຊັ້ນເອກ",
    description:
      "ແຕ່ລະເມັດຖືກຄັດເລືອກ ແລະທົດສອບຢ່າງພິຖີພິຖັນ ເພື່ອໃຫ້ໄດ້ມາດຕະຖານຄຸນນະພາບ ແລະຄວາມສົດສູງສຸດ.",
  },
  {
    icon: Truck,
    title: "ຈັດສົ່ງສົດໃໝ່",
    description: "ຈາກຟາມເຖິງໂຕະອາຫານໃນບໍ່ກີ່ມື້ ບໍ່ໃຊ້ເດືອນ. ໂສ່ງອຸປະທານທີ່ມີປະສິດທິພາບຮັບປະກັນຄວາມສົດສູງສຸດ.",
  },
]

export function AboutSection() {
  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-foreground mb-6">
              ປູກປັ້ນຄວາມເຢັ່ຍຍອດ ຜ່ານມໍລະດົກ ແລະນະວັດຕະກຳ
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              ຕະລອດ 3 ຮຸ່ນ ພວກເຮົາອຸທິດຕົນນຳສົ່ງເຂົ້າຊະນິດທີ່ດີທີ່ສຸດຈາກທົ່ວໂລກມາໃຫ້ທ່ານ.
              ຄຳມັ້ນສັນຍາຂອງເຮົາຕໍ່ຄຸນນະພາບ ຄວາມຍືນຍົງ ແລະປະເພນີ ຮັບປະກັນວ່າແຕ່ລະເມັດເຂົ້າຕອບໂຕ້ຕາມມາດຕະຖານທີ່ເຂັ້ມງວດຂອງເຮົາ.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <feature.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="/rice-farmer-in-traditional-field-with-golden-rice-.jpg"
              alt="ມໍລະດົກການທຳນາ"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
