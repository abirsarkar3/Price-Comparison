"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"
import { Percent, Clock } from "lucide-react"
import Image from "next/image"

export function FeaturedDeals() {
  const { t } = useTranslation()

  const deals = [
    {
      title: "Flash Sale on Groceries",
      description: "Up to 50% off on daily essentials",
      platform: "Zepto",
      discount: "50% OFF",
      timeLeft: "2h 30m",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      title: "Free Delivery Weekend",
      description: "No delivery charges on orders above ₹299",
      platform: "Swiggy",
      discount: "FREE DELIVERY",
      timeLeft: "1d 12h",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      title: "Medicine Mega Sale",
      description: "Extra 25% off on all medicines",
      platform: "Apollo 24/7",
      discount: "25% OFF",
      timeLeft: "5h 45m",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">{t("featuredDeals")}</h2>
        <p className="text-muted-foreground">{t("featuredDealsDesc")}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {deals.map((deal, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{deal.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{deal.description}</p>
                </div>
                <Image
                  src={deal.image || "/placeholder.svg"}
                  alt={deal.title}
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary">{deal.platform}</Badge>
                <Badge variant="destructive" className="bg-red-500">
                  <Percent className="h-3 w-3 mr-1" />
                  {deal.discount}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {t("endsIn")}: {deal.timeLeft}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
