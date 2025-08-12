"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "react-i18next"
import { Search, ShoppingCart, Utensils, Pill } from "lucide-react"
import { motion } from "framer-motion"

interface ModernSearchBarProps {
  defaultValue?: string
}

export function ModernSearchBar({ defaultValue = "" }: ModernSearchBarProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [query, setQuery] = useState(defaultValue)
  const [category, setCategory] = useState("groceries")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}&category=${category}`)
    }
  }

  const categoryIcons = {
    groceries: ShoppingCart,
    food: Utensils,
    medicines: Pill,
  }

  const placeholders = [
    "Search for Milk, Bread, Eggs...",
    "Find Pizza, Burger, Sushi...",
    "Look for Paracetamol, Vitamins...",
  ]

  return (
    <motion.form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-1 relative">
        <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl flex items-center overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center pl-6">
            <Search className="h-6 w-6 text-slate-400" />
          </div>
          <Input
            type="text"
            placeholder={placeholders[category === "groceries" ? 0 : category === "food" ? 1 : 2]}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg py-6 px-4 text-slate-900 dark:text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full sm:w-56 h-14 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 gradient-primary rounded-lg">
              {React.createElement(categoryIcons[category as keyof typeof categoryIcons], {
                className: "h-4 w-4 text-white",
              })}
            </div>
            <SelectValue className="text-slate-900 dark:text-white" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl">
          <SelectItem value="groceries">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <ShoppingCart className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-slate-900 dark:text-white">{t("groceries")}</span>
            </div>
          </SelectItem>
          <SelectItem value="food">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Utensils className="h-4 w-4 text-orange-600" />
              </div>
              <span className="text-slate-900 dark:text-white">{t("foodDelivery")}</span>
            </div>
          </SelectItem>
          <SelectItem value="medicines">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Pill className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-slate-900 dark:text-white">{t("medicines")}</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <Button
        type="submit"
        size="lg"
        className="h-14 px-8 gradient-primary hover:scale-105 transition-all duration-300 rounded-2xl shadow-2xl group"
      >
        {t("search")}
      </Button>
    </motion.form>
  )
}
