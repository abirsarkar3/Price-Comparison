"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useAuth } from "@/hooks/use-auth";
import { FirebaseService, LocalStorageService, isAuthenticatedUser } from "@/lib/firebase-service";

export type CartItem = {
  item: string;
  platform: string;
  price: number;
  delivery_fee: number;
  offer?: string;
  logo: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load from localStorage and Firestore
  useEffect(() => {
    const loadCart = async () => {
      const localCart: CartItem[] = LocalStorageService.get("cart") || [];
      
      // Only try Firestore if user is authenticated
      if (isAuthenticatedUser(user?.uid)) {
        try {
          const userData = await FirebaseService.getFromFirestore("users", user!.uid);
          const remoteCart: CartItem[] = userData?.cart || [];
          // Merge: prefer remote if exists, else local
          setCart(remoteCart.length > 0 ? remoteCart : localCart);
        } catch (error) {
          console.warn("Failed to load cart from Firestore, using localStorage:", error);
          setCart(localCart);
        }
      } else {
        // For anonymous users, use localStorage only
        setCart(localCart);
      }
    };
    loadCart();
  }, [user?.uid]);

  // Save to localStorage and Firestore
  useEffect(() => {
    LocalStorageService.save("cart", cart);
    
    // Only try Firestore if user is authenticated
    if (isAuthenticatedUser(user?.uid)) {
      const saveToFirestore = async () => {
        try {
          await FirebaseService.saveToFirestore("users", user!.uid, { cart });
        } catch (error) {
          console.warn("Failed to save cart to Firestore:", error);
          // Continue with localStorage only
        }
      };
      saveToFirestore();
    }
  }, [cart, user?.uid]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.item === item.item && i.platform === item.platform
      );
      if (existing) {
        return prev.map((i) =>
          i.item === item.item && i.platform === item.platform
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (item: CartItem) => {
    setCart((prev) =>
      prev.filter(
        (i) =>
          !(
            i.item === item.item &&
            i.platform === item.platform
          )
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
} 