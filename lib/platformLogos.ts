export interface PlatformLogo {
  name: string;
  logo: string;
  category: string;
  color: string;
  altText: string;
}

export const platformLogos: PlatformLogo[] = [
  {
    name: "Zepto",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Zepto_logo.svg/2560px-Zepto_logo.svg.png",
    category: "Groceries",
    color: "from-green-400 to-green-600",
    altText: "Zepto - 10 minute grocery delivery"
  },
  {
    name: "Blinkit",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Blinkit_logo.svg/2560px-Blinkit_logo.svg.png",
    category: "Groceries",
    color: "from-yellow-400 to-orange-500",
    altText: "Blinkit - Instant grocery delivery"
  },
  {
    name: "Zomato",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Zomato_logo.svg/2560px-Zomato_logo.svg.png",
    category: "Food",
    color: "from-red-400 to-red-600",
    altText: "Zomato - Food delivery and restaurant discovery"
  },
  {
    name: "Swiggy",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Swiggy_logo.svg/2560px-Swiggy_logo.svg.png",
    category: "Food",
    color: "from-orange-400 to-red-500",
    altText: "Swiggy - Food delivery platform"
  },
  {
    name: "Apollo 24|7",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Apollo_24x7_logo.svg/2560px-Apollo_24x7_logo.svg.png",
    category: "Medicine",
    color: "from-blue-400 to-blue-600",
    altText: "Apollo 24|7 - Online pharmacy and healthcare"
  },
  {
    name: "PharmEasy",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PharmEasy_logo.svg/2560px-PharmEasy_logo.svg.png",
    category: "Medicine",
    color: "from-teal-400 to-teal-600",
    altText: "PharmEasy - Online pharmacy"
  },
  {
    name: "Tata 1mg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/1mg_logo.svg/2560px-1mg_logo.svg.png",
    category: "Medicine",
    color: "from-purple-400 to-purple-600",
    altText: "Tata 1mg - Healthcare platform"
  },
  {
    name: "BigBasket",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/BigBasket_logo.svg/2560px-BigBasket_logo.svg.png",
    category: "Groceries",
    color: "from-green-500 to-emerald-600",
    altText: "BigBasket - Online grocery store"
  },
  {
    name: "Magicpin",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Magicpin_logo.svg/2560px-Magicpin_logo.svg.png",
    category: "Food",
    color: "from-pink-400 to-pink-600",
    altText: "Magicpin - Local discovery and rewards"
  },
];

// Fallback logos using data URLs for reliability
export const fallbackLogos: Record<string, string> = {
  "Zepto": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMjJDNTVFIiByeD0iOCIvPgo8dGV4dCB4PSI2MCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5aZXB0bzwvdGV4dD4KPC9zdmc+",
  "Blinkit": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjU5RTBCIiByeD0iOCIvPgo8dGV4dCB4PSI2MCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CbGlua2l0PC90ZXh0Pgo8L3N2Zz4=",
  "Zomato": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRUY0NDQ0IiByeD0iOCIvPgo8dGV4dCB4PSI2MCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ab21hdG88L3RleHQ+Cjwvc3ZnPg==",
  "Swiggy": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjk3MzE2IiByeD0iOCIvPgo8dGV4dCB4PSI2MCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Td2lnZ3k8L3RleHQ+Cjwvc3ZnPg==",
  "Apollo 24|7": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjM0I4MkY2IiByeD0iOCIvPgo8dGV4dCB4PSI2MCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BcG9sbG8gMjR8NzwvdGV4dD4KPC9zdmc+",
  "PharmEasy": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMTRCOEE2IiByeD0iOCIvPgo8dGV4dCB4PSI2MCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QaGFybUVhc3k8L3RleHQ+Cjwvc3ZnPg==",
  "Tata 1mg": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjQTg1NUY3IiByeD0iOCIvPgo8dGV4dCB4PSI2MCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UYXRhIDFtZzwvdGV4dD4KPC9zdmc+",
  "BigBasket": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMTBCOTgxIiByeD0iOCIvPgo8dGV4dCB4PSI2MCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CaWdCYXNrZXQ8L3RleHQ+Cjwvc3ZnPg==",
  "Magicpin": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRUM0ODk5IiByeD0iOCIvPgo8dGV4dCB4PSI2MCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NYWdpY3BpbjwvdGV4dD4KPC9zdmc+",
};