import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Award, Truck } from "lucide-react"

const features = [
  {
    icon: Leaf,
    title: "Sustainably Sourced",
    description:
      "Working directly with heritage farms that practice sustainable agriculture and traditional growing methods.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "Each grain is carefully selected and tested to ensure the highest standards of quality and freshness.",
  },
  {
    icon: Truck,
    title: "Fresh Delivery",
    description: "From farm to table in days, not months. Our efficient supply chain ensures maximum freshness.",
  },
]

export function AboutSection() {
  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Cultivating excellence through heritage and innovation
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              For three generations, we've been dedicated to bringing you the finest rice varieties from around the
              world. Our commitment to quality, sustainability, and tradition ensures that every grain meets our
              exacting standards.
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
              alt="Rice farming heritage"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
