// components/PlatformCard.tsx
import React from "react";
import { useCart } from "@/hooks/useCart";

type Props = {
  item?: string;
  logo: string;
  platform: string;
  price: number;
  delivery_fee: number;
  offer?: string;
  is_cheapest?: boolean;
  onAddToCart?: () => void;
};

export default function PlatformCard(props: Props) {
  const { addToCart } = useCart();
  return (
    <div
      className={`border rounded p-4 flex items-center justify-between shadow-sm ${
        props.is_cheapest ? "bg-green-50 border-green-400" : "bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <img src={props.logo} alt={props.platform} className="w-12 h-12 object-contain" />
        <div>
          <div className="font-semibold text-lg">{props.platform}</div>
          {props.offer && (
            <div className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded mt-1">
              {props.offer}
            </div>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="text-xl font-bold">₹{props.price}</div>
        <div className="text-sm text-gray-500">Delivery: ₹{props.delivery_fee}</div>
        {props.is_cheapest && (
          <div className="text-green-700 font-semibold mt-1">Cheapest</div>
        )}
        <button
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() =>
            addToCart({
              item: props.item,
              platform: props.platform,
              price: props.price,
              delivery_fee: props.delivery_fee,
              offer: props.offer,
              logo: props.logo,
              quantity: 1,
            })
          }
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}