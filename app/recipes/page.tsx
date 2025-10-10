import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, ChefHat } from "lucide-react"

const recipes = [
    {
        id: 1,
        title: "ເຂົ້າໜຽວມ່ວງ",
        description: "ເຂົ້າໜຽວມ່ວງແບບດັ້ງເດີມ ທີ່ມີລົດຊາດຫວານມັນ",
        image: "🍚",
        cookTime: "45 ນາທີ",
        servings: "4 ຄົນ",
        difficulty: "ງ່າຍ",
        ingredients: [
            "ເຂົ້າໜຽວມ່ວງ 2 ຈອກ",
            "ນ້ຳກະທິ 1 ຈອກ",
            "ນ້ຳຕານ 1/2 ບ່ວງນ້ຳຊາ",
            "ນ້ຳຕານໂຕນດ 3 ບ່ວງໂຕະ",
        ],
        steps: [
            "ແຊ່ເຂົ້າໜຽວມ່ວງໃນນ້ຳຢ່າງໜ້ອຍ 4 ຊົ່ວໂມງ ຫຼື ຄ້າງຄືນ",
            "ນຶ່ງເຂົ້າໃນຫົວດນຶ່ງປະມານ 30-40 ນາທີ",
            "ຕົ້ມນ້ຳກະທິກັບນ້ຳຕານ ແລະ ນ້ຳຕານໂຕນດ",
            "ຜະສົມເຂົ້າທີ່ສຸກແລ້ວກັບນ້ຳກະທິ",
            "ປ່ອຍໃຫ້ພັກປະມານ 15 ນາທີກ່ອນກິນ",
        ],
    },
    {
        id: 2,
        title: "ເຂົ້າຈ້າວ",
        description: "ເຂົ້າຈ້າວແບບດັ້ງເດີມ ກິນກັບແກງຕ່າງໆ",
        image: "🍛",
        cookTime: "30 ນາທີ",
        servings: "6 ຄົນ",
        difficulty: "ງ່າຍ",
        ingredients: [
            "ເຂົ້າຈ້າວຫອມມະລິ 3 ຈອກ",
            "ນ້ຳ 4.5 ຈອກ",
            "ນ້ຳຕານເລັກນ້ອຍ (ຖ້າມັກ)",
        ],
        steps: [
            "ລ້າງເຂົ້າໃຫ້ສະອາດ 2-3 ເທື່ອ",
            "ໃສ່ເຂົ້າ ແລະ ນ້ຳໃສ່ໝໍ້ຫຸງເຂົ້າ",
            "ປ່ອຍໃຫ້ເຂົ້າແຊ່ນ້ຳປະມານ 15 ນາທີ",
            "ກົດປຸ່ມຫຸງເຂົ້າ",
            "ເມື່ອສຸກແລ້ວໃຫ້ປ່ອຍໄວ້ປະມານ 10 ນາທີກ່ອນເປີດ",
        ],
    },
    {
        id: 3,
        title: "ເຂົ້າປຸ້ນໄກ່",
        description: "ເຂົ້າປຸ້ນທີ່ມີລົດຊາດຂອງໄກ່ຕົ້ມ",
        image: "🍗",
        cookTime: "1 ຊົ່ວໂມງ",
        servings: "4 ຄົນ",
        difficulty: "ປານກາງ",
        ingredients: [
            "ເຂົ້າຈ້າວ 2 ຈອກ",
            "ໄກ່ 500 ກຣາມ",
            "ຂີງ 3 ແຜ່ນ",
            "ຜັກບົ່ວ 2 ຕົ້ນ",
            "ນ້ຳມັນງາ 1 ບ່ວງໂຕະ",
            "ນ້ຳຕານ ແລະ ນ້ຳປຸງລົດຕາມຊອບ",
        ],
        steps: [
            "ຕົ້ມໄກ່ກັບຂີງຈົນສຸກ",
            "ແກະໄກ່ອອກເປັນເສັ້ນ ເກັບນ້ຳຕົ້ມໄວ້",
            "ຜັດເຂົ້າກັບນ້ຳມັນງາ ແລະ ຜັກບົ່ວ",
            "ໃສ່ນ້ຳຕົ້ມໄກ່ຕົ້ມຈົນເຂົ້າໜ້ຽວ",
            "ປະກອບດ້ວຍໄກ່ແກະ ແລະ ປັກຊີໃຫ້ຫອມ",
        ],
    },
    {
        id: 4,
        title: "ເຂົ້າຜັດອາເມລິກັນ",
        description: "ເຂົ້າຜັດສະໄຕລ์ອາເມລິກັນ ລົດຊາດຈັດຈ້ານ",
        image: "🍳",
        cookTime: "20 ນາທີ",
        servings: "2 ຄົນ",
        difficulty: "ງ່າຍ",
        ingredients: [
            "ເຂົ້າຈ້າວເຫຼືອ 3 ຈອກ",
            "ໄຂ່ໄກ່ 2 ໃບ",
            "ຜັກຕ່າງໆ (ຜັກກາດ, ຫົວຜັກທຽມ, ໝາກເຂືອເທດ)",
            "ນ້ຳມັນຖົ່ວ 2 ບ່ວງໂຕະ",
            "ນ້ຳປຸງລົດ 2 ບ່ວງໂຕະ",
        ],
        steps: [
            "ຕີໄຂ່ໃສ່ກະທະຮ້ອນ ແລະ ຄົນໄວໆ",
            "ໃສ່ຫົວຜັກທຽມຜັດໃຫ້ຫອມ",
            "ໃສ່ເຂົ້າເຫຼືອ ແລະ ຜັກຕ່າງໆ",
            "ປຸງລົດດ້ວຍນ້ຳປຸງລົດ",
            "ຜັດຈົນເຂົ້າແຫ້ງ ແລະ ຜັກສຸກດີ",
        ],
    },
    {
        id: 5,
        title: "ເຂົ້າຕົ້ມຫມູ",
        description: "ເຂົ້າຕົ້ມປະສົມກັບຊີ້ນຫມູ ແລະ ຜັກ",
        image: "🥘",
        cookTime: "50 ນາທີ",
        servings: "4 ຄົນ",
        difficulty: "ປານກາງ",
        ingredients: [
            "ເຂົ້າຈ້າວ 1 ຈອກ",
            "ຊີ້ນຫມູສັບ 300 ກຣາມ",
            "ນ້ຳຊຸບ 6 ຈອກ",
            "ຂີງຝານ 3 ແຜ່ນ",
            "ຜັກບົ່ວ, ຜັກກາດ",
            "ນ້ຳປາ, ນ້ຳຕານ",
        ],
        steps: [
            "ຕົ້ມນ້ຳໃຫ້ເດືອດ",
            "ໃສ່ເຂົ້າ ແລະ ຂີງ ຕົ້ມດ້ວຍໄຟອ່ອນ",
            "ຄົນບາງຄັ້ງເພື່ອບໍ່ໃຫ້ຕິດກ້ົນໝໍ້",
            "ໃສ່ຊີ້ນຫມູສັບເມື່ອເຂົ້າເລີ່ມໜ້ຽວ",
            "ປຸງລົດ ແລະ ໃສ່ຜັກກ່ອນປິດໄຟ",
        ],
    },
    {
        id: 6,
        title: "ເຂົ້າໜຽວມ່ວງມໍ່ວງ",
        description: "ເຂົ້າໜຽວມ່ວງກັບມໍ່ວງສຸກ ຂອງຫວານແບບໄທ",
        image: "🥭",
        cookTime: "1 ຊົ່ວໂມງ",
        servings: "3 ຄົນ",
        difficulty: "ງ່າຍ",
        ingredients: [
            "ເຂົ້າໜຽວມ່ວງ 1.5 ຈອກ",
            "ນ້ຳກະທິ 1 ຈອກ",
            "ນ້ຳຕານ 1/2 ບ່ວງນ້ຳຊາ",
            "ນ້ຳຕານໂຕນດ 3 ບ່ວງໂຕະ",
            "ໝາກມ່ວງສຸກ 2 ໝາກ",
            "ງາຂາວ (ສຳລັບໂຮຍ)",
        ],
        steps: [
            "ແຊ່ເຂົ້າໜຽວມ່ວງຄ້າງຄືນ",
            "ນຶ່ງເຂົ້າໃຫ້ສຸກດີ",
            "ຕົ້ມນ້ຳກະທິກັບນ້ຳຕານ ແລະ ນ້ຳຕານໂຕນດ",
            "ຜະສົມເຂົ້າກັບນ້ຳກະທິ ປ່ອຍໃຫ້ພັກ",
            "ປອກມໍ່ວງຝານເປັນແຜ່ນ",
            "ຈັດເສີບພ້ອມກັບເຂົ້າໜຽວມ່ວງ ແລະ ໂຮຍງາ",
        ],
    },
]

export default function RecipesPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
                <div className="container mx-auto max-w-4xl text-center">
                    <ChefHat className="w-16 h-16 mx-auto mb-6 text-primary" />
                    <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                        ສູດອາຫານ
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        ຄົ້ນພົບສູດອາຫານແບບດັ້ງເດີມ ແລະ ທັນສະໄຫມທີ່ໃຊ້ເຂົ້າຄຸນນະພາບຂອງພວກເຮົາ
                    </p>
                </div>
            </section>

            {/* Recipes Grid */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recipes.map((recipe) => (
                            <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="text-6xl mb-4 text-center">{recipe.image}</div>
                                    <CardTitle className="text-xl font-playfair">{recipe.title}</CardTitle>
                                    <CardDescription>{recipe.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{recipe.cookTime}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{recipe.servings}</span>
                                        </div>
                                        <Badge variant="secondary">{recipe.difficulty}</Badge>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">ສ່ວນປະກອບ:</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            {recipe.ingredients.map((ingredient, idx) => (
                                                <li key={idx}>• {ingredient}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">ວິທີເຮັດ:</h4>
                                        <ol className="text-sm text-muted-foreground space-y-1">
                                            {recipe.steps.map((step, idx) => (
                                                <li key={idx}>
                                                    {idx + 1}. {step}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tips Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="font-playfair text-3xl font-bold text-foreground text-center mb-8">
                        ເຄັດລັບການຫຸງເຂົ້າ
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>ເຂົ້າຈ້າວ</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                <ul className="space-y-2">
                                    <li>• ລ້າງເຂົ້າໃຫ້ສະອາດ 2-3 ເທື່ອ</li>
                                    <li>• ໃຊ້ອັດຕາສ່ວນນ້ຳ 1:1.5 (ເຂົ້າ:ນ້ຳ)</li>
                                    <li>• ແຊ່ນ້ຳກ່ອນຫຸງ 15-20 ນາທີ</li>
                                    <li>• ປ່ອຍໃຫ້ພັກຫຼັງຫຸງສຸກ 10 ນາທີ</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>ເຂົ້າໜຽວ</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                <ul className="space-y-2">
                                    <li>• ແຊ່ນ້ຳຢ່າງໜ້ອຍ 4 ຊົ່ວໂມງ</li>
                                    <li>• ນຶ່ງດ້ວຍຫົວດນຶ່ງພື້ນເມືອງ</li>
                                    <li>• ນຶ່ງປະມານ 30-40 ນາທີ</li>
                                    <li>• ກວດເບິ່ງຄວາມສຸກເປັນໄລຍະ</li>
                                </ul>
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

