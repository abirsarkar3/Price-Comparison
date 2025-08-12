"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "react-i18next"
import { addToCart } from "@/lib/cart-storage"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    prices: Array<{
      platform: string
      price: number
      deliveryCharge: number
      coupon?: string
    }>
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { user } = useAuth()
  const { t } = useTranslation()
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: t("signInRequired"),
        description: t("signInToAddToCart"),
        variant: "destructive",
      })
      return
    }

    setIsAdding(true)
    try {
      // Convert price data to cart item format
      const platforms: any = {}
      product.prices.forEach((price) => {
        platforms[price.platform] = {
          price: price.price,
          deliveryCharge: price.deliveryCharge,
          coupon: price.coupon,
          available: true,
        }
      })

      await addToCart(user.uid, {
        id: product.id,
        name: product.name,
        quantity: 1,
        platforms,
      })

      toast({
        title: t("addedToCart"),
        description: t("itemAddedToCart", { item: product.name }),
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failedToAddToCart"),
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button onClick={handleAddToCart} disabled={isAdding} size="sm" variant="outline" className="gap-2 bg-transparent">
      {isAdding ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      {t("addToCart")}
    </Button>
  )
}
