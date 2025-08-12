"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "react-i18next"
import { ShoppingCart, Utensils, Pill } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export function ModernCategorySelector() {
  const { t } = useTranslation()

  const categories = [
    {
      id: "groceries",
      name: t("groceries"),
      description: t("groceriesDesc"),
      icon: ShoppingCart,
      platforms: ["Zepto", "Blinkit", "Swiggy Instamart", "BigBasket"],
      gradient: "from-green-400 to-emerald-600",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      iconBg: "bg-green-500",
    },
    {
      id: "food",
      name: t("foodDelivery"),
      description: t("foodDeliveryDesc"),
      icon: Utensils,
      platforms: ["Zomato", "Swiggy", "MagicPin"],
      gradient: "from-orange-400 to-red-600",
      bgGradient: "from-orange-500/10 to-red-500/10",
      iconBg: "bg-orange-500",
    },
    {
      id: "medicines",
      name: t("medicines"),
      description: t("medicinesDesc"),
      icon: Pill,
      platforms: ["Apollo 24/7", "PharmEasy", "Tata 1mg"],
      gradient: "from-blue-400 to-indigo-600",
      bgGradient: "from-blue-500/10 to-indigo-500/10",
      iconBg: "bg-blue-500",
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {t("categories")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("categoriesDesc")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  rotateY: 5,
                  scale: 1.02,
                }}
                className="perspective-1000"
              >
                <Link href={`/search?category=${category.id}`}>
                  <Card
                    className={`h-full glass-card border-0 overflow-hidden group cursor-pointer bg-gradient-to-br ${category.bgGradient} hover:shadow-2xl transition-all duration-500`}
                  >
                    <CardContent className="p-8 relative">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-gradient-to-br from-white to-transparent"></div>
                        <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-gradient-to-br from-white to-transparent"></div>
                      </div>

                      {/* Icon */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-16 h-16 ${category.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </motion.div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">{category.description}</p>

                      {/* Platforms */}
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-primary">{t("platforms")}:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {category.platforms.map((platform, platformIndex) => (
                            <motion.div
                              key={platform}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.2 + platformIndex * 0.1 }}
                              className="flex items-center gap-2 glass rounded-lg p-2"
                            >
                              <Image
                                src={`/placeholder.svg?height=20&width=20&query=${platform.toLowerCase()} logo`}
                                alt={platform}
                                width={20}
                                height={20}
                                className="rounded"
                              />
                              <span className="text-xs font-medium truncate">{platform}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                      />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
