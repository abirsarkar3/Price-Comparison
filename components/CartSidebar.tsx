import React from "react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { getAnonUserId } from "@/lib/anonUserId";
import { collection, addDoc } from "firebase/firestore";

export default function CartSidebar() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity + item.delivery_fee, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const userId = user?.uid || getAnonUserId();
    const order = {
      items: cart,
      total,
      createdAt: new Date(),
      userId,
    };
    await addDoc(collection(db, "orders"), order);
    clearCart();
    alert("Order placed! Thank you.");
  };

  return (
    <aside className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 z-50 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="text-gray-500">Cart is empty.</div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {cart.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 border-b py-2">
              <img src={item.logo} alt={item.platform} className="w-10 h-10 object-contain" />
              <div className="flex-1">
                <div className="font-semibold">{item.item}</div>
                <div className="text-xs text-gray-500">{item.platform}</div>
                <div className="text-xs">Qty: {item.quantity}</div>
                <div className="text-xs">₹{item.price} + ₹{item.delivery_fee} delivery</div>
              </div>
              <button
                className="text-red-600 text-xs ml-2"
                onClick={() => removeFromCart(item)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 font-bold">Total: ₹{total}</div>
      <button
        className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={clearCart}
        disabled={cart.length === 0}
      >
        Clear Cart
      </button>
      <button
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={handleCheckout}
        disabled={cart.length === 0}
      >
        Checkout
      </button>
    </aside>
  );
}