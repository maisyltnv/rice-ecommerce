import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-background"></div>
              <span className="font-playfair text-xl font-semibold">ເຂົ້າດີ.</span>
            </div>
            <p className="text-background/80 mb-4">
              ພວກເຮົາໄດ້ຄັດສັນຂ້າວຊັ້ນນໍາຢ່າງພິຖີພິຖັນ ທົ່ວປະເທດລາວ.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-background hover:text-background/80">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-background hover:text-background/80">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-background hover:text-background/80">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4">ສິນຄ້າ</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/basmati" className="text-background/80 hover:text-background transition-colors">
                  ເຂົ້າຈ້າວມະລິ
                </Link>
              </li>
              <li>
                <Link href="/products/jasmine" className="text-background/80 hover:text-background transition-colors">
                  ເຂົ້າຈ່າຍໄຮ່
                </Link>
              </li>
              <li>
                <Link href="/products/wild" className="text-background/80 hover:text-background transition-colors">
                  ເຂົ້າໄກ່ນ້ອຍຊຽງຂວາງ
                </Link>
              </li>
              <li>
                <Link href="/products/brown" className="text-background/80 hover:text-background transition-colors">
                  ເຂົ້ານາປີ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">ບໍລິສັດ</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-background/80 hover:text-background transition-colors">
                  ກ່ຽວກັບພວກເຮົາ
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-background/80 hover:text-background transition-colors">
                  ຄວາມຍືນຍົງ
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-background/80 hover:text-background transition-colors">
                  ຮ່ວມວຽກກັບເຮົາ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-background/80 hover:text-background transition-colors">
                  ຕິດຕໍ່
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">ຕິດຕາມຂ່າວສານ</h3>
            <p className="text-background/80 mb-4">ຮັບຂ່າວສານລ່າສຸດເກືອບຊະນິດໃໝ່ ແລະຂໍ້ສະເໜີພິເສດ.</p>
            <div className="flex space-x-2">
              <Input
                placeholder="ປ້ອນອີເມວຂອງທ່ານ"
                className="bg-background/10 border-background/20 text-background placeholder:text-background/60"
              />
              <Button variant="secondary" size="sm">
                ຕິດຕາມ
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-background/60">© 2025 Heritage Rice Co. ສິດທິທັງໝົດຖືກສົງວນ.</p>
        </div>
      </div>
    </footer>
  )
}
