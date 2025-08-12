"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "react-i18next"
import { ShoppingCart, Utensils, Pill } from "lucide-react"

export function CategorySelector() {
  const { t } = useTranslation()

  const categories = [
    {
      id: "groceries",
      name: t("groceries"),
      description: t("groceriesDesc"),
      icon: ShoppingCart,
      platforms: ["Zepto", "Blinkit", "Swiggy Instamart", "BigBasket"],
      color: "bg-green-500",
    },
    {
      id: "food",
      name: t("foodDelivery"),
      description: t("foodDeliveryDesc"),
      icon: Utensils,
      platforms: ["Zomato", "Swiggy", "MagicPin"],
      color: "bg-orange-500",
    },
    {
      id: "medicines",
      name: t("medicines"),
      description: t("medicinesDesc"),
      icon: Pill,
      platforms: ["Apollo 24/7", "PharmEasy", "Tata 1mg"],
      color: "bg-blue-500",
    },
  ]

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">{t("categories")}</h2>
        <p className="text-muted-foreground">{t("categoriesDesc")}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Link key={category.id} href={`/search?category=${category.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{t("platforms")}:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
