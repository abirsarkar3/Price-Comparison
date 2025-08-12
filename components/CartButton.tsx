import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";

export default function CartButton({ onClick }: { onClick: () => void }) {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      className="relative flex items-center px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      onClick={onClick}
      aria-label="Open cart"
    >
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1.5 py-0.5">
          {itemCount}
        </span>
      )}
    </button>
  );
}