import { db } from "./firebase"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"

interface CartItem {
  id: string
  name: string
  quantity: number
  platforms: {
    [platform: string]: {
      price: number
      deliveryCharge: number
      coupon?: string
      available: boolean
    }
  }
  addedAt: Date
}

export async function getUserCart(userId: string): Promise<CartItem[]> {
  try {
    const cartRef = doc(db, "carts", userId)
    const cartSnap = await getDoc(cartRef)

    if (cartSnap.exists()) {
      return cartSnap.data().items || []
    }
    return []
  } catch (error) {
    console.error("Error fetching user cart:", error)
    return []
  }
}

export async function addToCart(userId: string, item: Omit<CartItem, "addedAt">): Promise<void> {
  try {
    const cartRef = doc(db, "carts", userId)
    const cartSnap = await getDoc(cartRef)

    const cartItem: CartItem = {
      ...item,
      addedAt: new Date(),
    }

    if (cartSnap.exists()) {
      const existingItems = cartSnap.data().items || []
      const existingItemIndex = existingItems.findIndex((i: CartItem) => i.id === item.id)

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        existingItems[existingItemIndex].quantity += item.quantity
      } else {
        // Add new item
        existingItems.push(cartItem)
      }

      await updateDoc(cartRef, { items: existingItems })
    } else {
      // Create new cart
      await setDoc(cartRef, { items: [cartItem] })
    }
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw error
  }
}

export async function updateUserCart(userId: string, optimization: any): Promise<void> {
  try {
    const cartRef = doc(db, "carts", userId)
    await updateDoc(cartRef, {
      optimization,
      optimizedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating cart optimization:", error)
    throw error
  }
}

export async function removeFromCart(userId: string, itemId: string): Promise<void> {
  try {
    const cartRef = doc(db, "carts", userId)
    const cartSnap = await getDoc(cartRef)

    if (cartSnap.exists()) {
      const existingItems = cartSnap.data().items || []
      const updatedItems = existingItems.filter((item: CartItem) => item.id !== itemId)
      await updateDoc(cartRef, { items: updatedItems })
    }
  } catch (error) {
    console.error("Error removing from cart:", error)
    throw error
  }
}

export async function clearCart(userId: string): Promise<void> {
  try {
    const cartRef = doc(db, "carts", userId)
    await updateDoc(cartRef, { items: [] })
  } catch (error) {
    console.error("Error clearing cart:", error)
    throw error
  }
}
